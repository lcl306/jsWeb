process.on("message", function(m, server){   //接收master传递的server句柄
	if(m=='server'){
		server.on('connection', function(socket){
			socket.end('handle by workerTcp: pid='+process.pid+'\n');
		});
	}
});