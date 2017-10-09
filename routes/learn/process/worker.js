var http = require('http');

http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type':'text/plain'});
	res.end("handle by worker pid="+process.pid+"\n");
}).listen(Math.round((1+Math.random())*10000), '127.0.0.1');


process.on("message", function(m, tcp){   //worker接收信息
	console.info("get message from master: ", m);
});
process.send({message:"worker send message"});	//worker发送信息
