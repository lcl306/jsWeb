var mongoClient = require("mongodb").MongoClient;
var logger = require('./logger').logger;

DbClient = function(url){
	
	this.connect = function(callback){
		var options = {server:{auto_reconnect:true},db:{safe:true}};
		mongoClient.connect(url,options,function(err, db){ //mongod会默认5个连接，因为nodejs是单线程，采用请求回调的方式，连接可以重复使用，不需要关闭
			if(err){
				logger.error(err);
				return callback(err, null);
			}else{
				/*db.on("close", function(err, db){
					if(err){
						logger.error(err);
					}else{
						logger.info("mongo db close..");
					}
				});*/
				callback(null, db);
			}
		});
	};
};

//var dbClient = new DbClient("mongodb://test11:123456@127.0.0.1:27017/test");
var dbClient = new DbClient("mongodb://127.0.0.1:27001/test");
exports.dbClient = dbClient;
