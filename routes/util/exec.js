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

exports.after = after;