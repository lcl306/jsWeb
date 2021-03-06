var mongoClient = require("mongodb").MongoClient;
var logger = require('../register/logger').logger;
//var exec = require('../util/exec');
//var Deferred = require('../util/deferred');
var Q = require('q');
var param = require('../../context/param.json');

/**
 * http://mongodb.github.io/node-mongodb-native/api-generated/
 * */
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
	
	this.con = function(){
		var options = {server:{auto_reconnect:true},db:{safe:true}};
		////////////////////////////////////////////////////////方式1
		/*var deferred = new Deferred();
		mongoClient.connect(url, options, deferred.proxy());
		return deferred.promise;*/
		////////////////////////////////////////////////////////方式2
		/*var defer = Q.defer();
		mongoClient.connect(url, options, function(err, db){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(db);
			}
		});
		return defer.promise;*/
		/////////////////////////////////////////////////////////方式3
		/*var connect = Q.denodeify(mongoClient.connect);
		return connect(url, options);*/
		/////////////////////////////////////////////////////////方式4
		/*var defer = Q.defer();
		mongoClient.connect(url, options, defer.makeNodeResolver());
		return defer.promise;*/
		/////////////////////////////////////////////////////////方式5
		return Q.nfcall(mongoClient.connect,url, options);
	};
};

//var dbClient = new DbClient("mongodb://test11:123456@127.0.0.1:27017/test");
var dbClient = new DbClient(param.mongoCon);
exports.dbClient = dbClient;
