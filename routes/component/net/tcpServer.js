var net = require('net');
var iconv = require('iconv-lite');

var port = 3356;

function createServer(){
	var server = net.createServer(function(socket){
		var chunks = [];
		var size = 0;
		socket.on('data', function(data){
			console.info(data);
			socket.write(data);
			chunks.push(data);
			size +=data.length;
		});
		socket.on('end', function(){
			console.info('socket end: ' +iconv.decode(Buffer.concat(chunks, size), 'utf8'));
		});
		socket.on('error', function(){
			console.error('client error!!!');
		});
		socket.on('timeout', function(){
			console.info('server timeout ...');
		});
	});
	server.listen(port, function(){
		console.info('server start');
	});
}

createServer();

