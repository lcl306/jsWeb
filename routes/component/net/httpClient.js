var http = require('http');
var iconv = require('iconv-lite');

var agent = new http.Agent({
	maxSockets: 5 //与浏览器相同，通过一个连接池，对同一个服务器发起HTTP请求，最多可以创建5个连接
}); 

function end(res, callback){
	console.info('STATUS： ' +res.statusCode);
	console.info('HEADERS: ' +JSON.stringify(res.headers));
	var chunks = [];
	var size = 0;
	res.on("data", function(chunk){
		chunks.push(chunk);
		size += chunk.length;
	});
	res.on("end", function(){
		var buf = Buffer.concat(chunks, size);
		callback(JSON.parse(iconv.decode(buf, 'utf8')));
	});
}

/**
  var options ={
	hostname: '127.0.0.1',
	port:3000,
	path: '/bmap/get_datas',
	method: 'POST',
	dataType: 'json'
  };
  @data： options.dataType: 'json' 时 ：{name:'aaa'}  不设置dataType时，'name=aaa'
  @callback(result)：result均为json类型
*/
function once(options, data, callback){
	options.agent = agent;  //options.agent = false; //表明不创建连接池，直接连接
	//不设置content-type，服务端req.body是无法取得值的
	options.headers = {
		"Content-Type": options.dataType=='json'?'application/json':'application/x-www-form-urlencoded'
	};
	var req = http.request(options, function(res){
		end(res, callback);
	});
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	
	req.on('connect', function(){
		console.info('client connect...');
	});
	req.write(options.dataType=='json'?JSON.stringify(data):data);
	req.end(); 
}

exports.end = end;
exports.once = once;

