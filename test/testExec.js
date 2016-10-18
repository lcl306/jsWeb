var events = require('events');
var exec = require("../routes/component/util/exec");
var async = require('async');
var fs = require('fs');

var testAfter = function(){
	var done = exec.after(3, function(results){
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
}

var testParallelFile = function(){
	var filenames = ['testQ.js', 'testType.js'];
	exec.parallelFile(filenames, 'utf-8', function(err, results){
		if(!err){
			results.forEach(function(r){
				console.info(r);
			});
		}
	});
};

var testBagFile = function(){
	var filenames = ['testQ.js', 'testType.js'];
	exec.bagFile(filenames, 'utf-8').then(function(results){
		results.forEach(function(r){
			console.info(r);
		});
	});
};

/**
waterfall将第一个func的callback内容，作为参数传递给了第二个func，依次类推，第二个func的回调=第三个func的参数...
*/
var testWaterfall = function(){
	async.waterfall([
		function(callback){
			fs.readFile('filename', 'utf-8', callback);
		},
		function(arg1, callback){
			fs.readFile(arg1, 'utf-8', callback);
		}
	], function(err, result){
		if(err){
			console.error(err);
		}else{
			console.info(result);
		}
	});
}

testAfter();
testParallelFile();
testWaterfall();
testBagFile();