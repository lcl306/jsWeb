var dgram = require('dgram');

var port = 3357;

var receiveSocket = dgram.createSocket('udp4');

receiveSocket.on('message', function(msg, rinfo){
	console.info('server got: ' +msg +' from '+rinfo.address +':'+rinfo.port);
});

receiveSocket.on('listening', function(){
	var address = receiveSocket.address();
	console.info('server listening '+address.address+':'+address.port);
});

receiveSocket.on('error', function(){
	console.error('receive message error!!!');
});

receiveSocket.bind(port);

var sendSocket = dgram.createSocket('udp4');
var buf =new Buffer('你好，node.js。');
// send参数：消息buffer，buffer偏移量，buffer长度，目标端口，目标地址，发送完的回调
sendSocket.send(buf, 0, buf.length, port, 'localhost', function(err, bytes){
	sendSocket.close();
});
sendSocket.on('close', function(){
	console.info('sendSocket close.');
});