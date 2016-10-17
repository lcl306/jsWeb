var events = require('events');
var exec = require("../routes/component/util/exec");

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

exports.testAfter = testAfter;
