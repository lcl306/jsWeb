var httpServer=require('http').createServer(function(req, res){
	res.writeHead(200, {'Content-Type':'text/plain'});
	res.end('handle by workerHttp, pid='+process.pid+'\n');
});

process.on("message", function(m, tcpServer){
	if(m=='server'){
		tcpServer.on('connection', function(socket){
			httpServer.emit('connection', socket);  //tcp、http之间用emit传递socket，send是进程之间的命令，通过IPC管道传递
		});
	}
});