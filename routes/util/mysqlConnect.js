var mysql = require("mysql");
var logger = require('./logger').logger;

MyCon = function(options){
	
	//this.connection = mysql.createConnection(options);
	
	this.pool = mysql.createPool(options);
	
	//第一次进行查询时，才创建connectionLimit数量的连接
	//如果mysql连接wait_timeout，或mysql重启，再次进行查询时，会重新创建connectionLimit数量的连接
	this.pool.on("connection", function(connection){
		logger.info("connect ...");
	});
	
	this.pool.on("enqueue", function(connection){
		logger.info("connection enter queue ...");
	});

	/*this.connect = function(){
		this.connection.connect(function(err){
			if(err){
				logger.error(err.message);
				return;
			}
			logger.info("mysql connection succeed");
		});
	};*/
	
	this.query = function(sql, sqlParam, callback){
		if(typeof sqlParam == 'function'){
			callback = sqlParam;
			sqlParam = [];
		}
		sqlParam = sqlParam || [];
		this.pool.getConnection(function(err, connection){
			if(err){
				//err.code === 'PROTOCOL_CONNECTION_LOST' 表示连接中断
				logger.error(err.code+": "+err.message);
				return;
			}
			connection.query(sql, sqlParam, function(err, result){
				if(err){
					logger.error(err.code+": "+err.message);
					return;
				}
				// 如果是DML操作，result返回操作信息，result.insertId是mysql的主键值
				// 如果是查询操作，result返回查询结果
				if(callback) callback(result);
			});
			connection.release();
		});
	}
	
	this.batch = function(sqls){
		var db = this;
		var results = [];
		this.pool.getConnection(function(err, connection){
			db.openTrans(connection);
			for(var p in sqls){
				var info = sqls[p];
				db.trans(connection, info.sql, info.sqlParam, function(result){
					results.push(result);
				});
			}
			db.release(connection,true);
		});
		return results;
	}
	
	this.openTrans = function(connection){
		//开启事务
		connection.query("start transaction", function(err, result){
			if(err){
				logger.error(err.code+": "+err.message);
				return;
			}
		});
	};
	
	this.release = function(connection, isCommit){
		if(isCommit){
			connection.query("COMMIT", function(err, result){
				if(err){
					logger.error(err.code+": "+err.message);
					return;
				}
			});
		}
		connection.release();  //释放连接（连接释放掉后，可用，不需要重新连接），否则mysql wait_timeout（默认8小时）自动断开连接
	};
	
	this.trans = function(connection, sql, sqlParam, callback){
		if(typeof sqlParam == 'function'){
			callback = sqlParam;
			sqlParam = [];
		}
		sqlParam = sqlParam || [];
		connection.query(sql, sqlParam, function(err, result){
			if(err){
				logger.error(err.code+": "+err.message);
				connection.query("ROLLBACK", function(err, result){
					if(err){
						logger.error(err.code+": "+err.message);
						return;
					}
				});
			}else{
				if(callback) callback(result);
			}
		});
	};
	
	/*this.end = function(){
		//end等待sql结束，调用该回调方法，再中断连接；如果sql出错（返回err），调用该回调方法，再中断连接
		//this.connection.destory(); 直接中断连接，不管sql是否结束
		this.connection.end(function(err){
			if(err){
				logger.error(err.message);
				return;
			}
			logger.info("mysql connection end");
		});
	};*/
	
};

var myCon = new MyCon({
	// connection 选项
	host     : "127.0.0.1",
	user     : "ksk",
	password : "123456",
	port     : "3306",
	database : "nodejs",
	supportBigNumbers : true, //数据库支持bigint或decimal类型列时，需要设此option为true （默认：false）
	//charset：连接字符集（默认：'UTF8_GENERAL_CI'，注意字符集的字母都要大写）
	//connectTimeout：连接超时（默认：不限制；单位：毫秒）
	//typeCast：是否将列值转化为本地JavaScript类型值 （默认：true）
	
	// pool选项
	// waitForConnections 当连接池没有连接或超出最大限制时，设置为true且会把连接放入队列，设置为false会返回error
	// 队列中默认为5个连接，connectionLimit=3时，2个connection enqueue，3个connection connect
	connectionLimit : 5 //连接数限制，默认：5
	//queueLimit 最大连接请求队列限制，设置为0表示不限制，默认：0
});

exports = module.exports = myCon;
