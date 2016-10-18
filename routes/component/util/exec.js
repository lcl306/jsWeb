//var Deferred = require('./deferred');
var Q = require('q');
var async = require('async');
var fs = require('fs');
var Bagpipe = require('bagpipe');
var logger = require('../register/logger').logger;

/**
 * 解决多次事件，一次回调的问题，返回一个函数
 * 	var done = exec.after(3, function(results){
		for(var p in results){
			console.info(p+"="+results[p]);
		}
	});

	var emitter = new events.EventEmitter();
	emitter.on("done", done);
	emitter.on("error", function(err){
		console.error(err);
	});

	//三次不同的callback中，发布done事件
	emitter.emit("done", "key-a", "a1-value");
	emitter.emit("done", "key-b", "b1-value");
	emitter.emit("done", "key-c", "c1-value");
 */
after = function(times, callback){
	var count=0, results={};
	return function(key, value){
		count++;
		results[key] = value;
		if(count==times){
			callback(results);
		}
	};
};

all = function(promises){
	var count = promises.length;
	var results = [];
	var defer = Q.defer();
	promises.forEach(function(promise){
		promise.then(function(value){     // (value)=>{} 等价于  function(value){}
			results.push(value);
			count--;
			if(count==0){
				defer.resolve(results);
			}
		}, function(err){
			defer.reject(err);
		});
	});
	return defer.promise;
};

/**
 * 	var readFile = smooth(fs.readFile);
	readFile('file1.txt', 'utf8').then(function (file1) {
		...
	});
	实际开发用Q不要用它
 * 
smooth = function(method){
	return function(){
		var deferred = new Deferred();
		var args = Array.prototype.slice.call(arguments, 1);  //将函数的参数变为数组，slice表示数组返回选定的元素slice(start,end)，slice(1)表示1-length，即返回全部数组，该方法则返回全部参数，放入数组汇总
		args.push(deferred.proxy());
		console.info(args);
		method.apply(null, args);
		return deferred.promise;
	};
};*/

/**
同时读取多个file，读取后的结果，在back中一次处理，如果有err，只将第一个err放入back
*/
parallelFile = function(filenames, code, back){
	var funcs = [];
	filenames.forEach(function(filename){
		var func = function(callback){
			fs.readFile(filename, code, callback);
		};
		funcs.push(func);
	});
	
	async.parallel(funcs, function(err, results){
		if(err){
			logger.error(err);
			back(err, results);
		}else{
			back(err, results);
		}
	});
};

bagFile = function(filenames, code){
	var defer = Q.defer();
	var count = filenames.length;
	var results = [];
	filenames.forEach(function(filename){
		var bagpipe = new Bagpipe(10, {   //队列长度10
			//如果拒绝和踢出，不能用最后统一处理的方式，因为没有err，不会count--
			//refuse: true,	//超过队列长度，拒绝
			//timeout : 6000  //callback方法超过1分钟，踢出
		});
		bagpipe.on("full", function(length){
			logger.warn("too much file wait, the queue length is "+length);
		});
		bagpipe.push(fs.readFile, filename, code, function(err, result){
			if(err){
				logger.error(err);
				defer.reject(err);
			}else{
				results.push(result);
				count--;
				if(count==0){
					defer.resolve(results);
				}
			}
		});
	});
	return defer.promise;
};

exports.after = after;
exports.all = all;
exports.parallelFile = parallelFile;
exports.bagFile = bagFile;