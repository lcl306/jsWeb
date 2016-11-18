var net = require('net');

var port = 3356;

var times = 0;

var client = net.connect({port:port}, function(){
	client.write('你好！');
});

client.on('connect', function(){
	console.info('connect...');
});

client.on('data', function(data){
	console.info(data);
	times++;
	if(times>=2) client.end();
	else client.write(data);
});

client.on('end', function(){
	console.info('client end');
});

client.on('error', function(){
	console.error('server send error !!!');
});