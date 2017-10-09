/**
var Worker = require("../routes/component/cluster/BaseWorker");

new Worker(require('http').createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('handled by child, pid is ' + process.pid + '\n');
	throw new Error('throw exception');
}));

*/
var logger = require('../register/logger').logger;

module.exports = function(server){
	var worker;
	var EXIT_TIMEOUT = 5000;
	
	process.on("message", function(m, tcpServer){
		if(m==="server"){
			worker = tcpServer;
			tcpServer.on("connection", function(socket){
				server.emit("connection", socket);
			});
		}
	});
	
	process.on("uncaughtException", function(err){
		logger.error(err);
		process.send({act:"suicide"});
		//断开所有连接
		worker.close(function(){
			process.exit(1); //断开所有连接后退出,触发on("exit")事件
		});  
		//如果断开连接时间太久，超过EXIT_TIMEOUT后，子进程退出
		setTimeout(function(){
			process.exit(1);
		}, EXIT_TIMEOUT);
	});
}
