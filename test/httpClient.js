var http = require('http');
var iconv = require('iconv-lite');

var options ={
	hostname: '127.0.0.1',
	port:3001,
	path: '/bmap/get_datas',
	method: 'POST'
};

var req = http.request(options, function(res){
	console.info('STATUS： ' +res.statusCode);
	console.info('HEADERS: ' +res.headers);
	var chunks = [];
	var size = 0;
	res.on('data', function(chunk){
		chunks.push(chunk);
		size+=chunk.length;
		console.info(iconv.decode(chunk, 'utf8'));
	});
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.on('connect', function(){
	console.info('client connect...');
});

req.write("{node:'aaa'}");
req.end(); 
