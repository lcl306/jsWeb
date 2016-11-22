var memcached = require('memcached');
var logger = require('../register/logger').logger;
var param = require("../../context/param.json");

var client = new memcached([param.memcacheCon], {poolSize:10}); //已经连接了memcached，连接默认idle后1秒钟断掉

client.on( "issue", function( issue ){
	logger.info( "Issue occured on server " + issue.server + ", " + issue.retries  + " attempts left until failure" );
});
	
client.on( "failure", function( issue ){
	logger.error( issue.server + " failed!" );
});
	
client.on( "reconnecting", function( issue ){
	logger.info( "reconnecting to server: " + issue.server + " failed!" );
});

function stats(){
	client.stats( function( err, result ){
		if( err ) logger.error( err );
		logger.info(result);
		//client.end(); // 如果100%确定不再使用connection, 调用关闭方法
	});
}

function items(){
	client.items( function( err, result ){
		if( err ) logger.error( err );
		logger.info(result);
	});
}

function slabs(){
	client.slabs( function( err, result ){
		if( err ) logger.error( err );
		logger.info(result);
	});
}

//stats();
//items();
//slabs();

exports = module.exports = client;
