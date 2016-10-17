var Deferred = require('./deferred');

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

/**
 * 	var readFile = smooth(fs.readFile);
	readFile('file1.txt', 'utf8').then(function (file1) {
		...
	});
 * */
smooth = function(method){
	return function(){
		var deferred = new Deferred();
		var args = Array.prototype.slice.call(arguments, 1);  //将函数的参数变为数组，slice表示数组返回选定的元素slice(start,end)，slice(1)表示1-length，即返回全部数组，该方法则返回全部参数，放入数组汇总
		args.push(deferred.proxy());
		method.apply(null, args);
		return deferred.promise;
	};
};

exports.after = after;
exports.smooth = smooth;