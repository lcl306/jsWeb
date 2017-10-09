var net = require('net');
var type = require('../util/type');
var BufferHelper = require('../util/bufferhelper');

var port = 83;

var times = 0;

var client = net.connect({port:port}, function(){
	client.write('你好!!\n');
});

client.on('connect', function(){
	console.info('connect...');
});

//var bufferHelper = new BufferHelper();
var chunks = [];  

client.on('data', function(data){
	console.info(times);
	/*if(type.isBuffer(data)){
		console.info(data.toString("utf-8"));
	}else{
		console.info(data);
	}*/
	//bufferHelper.concat(data);
	chunks.push(data);  
  	
	times++;
	if(times>=2) client.end();
	else{
		var message = "第"+times+"发送。\n";
		client.write(message);
	}
});
 
client.on('end', function(){
	console.info('client end');
  	//var message = bufferHelper.toBuffer().toString("utf-8").split("\n");
  	var buf = Buffer.concat(chunks);
  	if(Buffer.isEncoding("utf-8")){
  		var message = buf.toString("utf-8").split("\n"); //合并buffer数组
	  	for(var i=0; i<message.length; i++){
	  		console.info(message[i]);
	  		console.info(Buffer.byteLength(message[i]));
	  	}
  	}
  	
});

client.on('error', function(){
	console.error('server send error !!!');
});