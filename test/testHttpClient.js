var httpClient = require("../routes/component/net/httpClient");

var options ={
	hostname: '127.0.0.1',
	port:3000,
	path: '/bmap/get_datas',
	method: 'POST',
	dataType: 'json'
};

httpClient.once(options, {name:'aaa'}, function(data){
	console.info(data);
});