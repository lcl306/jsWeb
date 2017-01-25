require("http").createServer(function(req, res){
	res.writeHead(200);
	res.end("hello world, worker pid is "+process.pid +"\n");
	throw new Error('throw exception');
}).listen(8000);