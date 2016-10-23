var mysql = require("mysql");
var logger = require('../register/logger').logger;
var async = require("async");
var param = require("../../context/param.json");

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
				connection.release();
				return callback(err,null);
			}
			connection.query(sql, sqlParam, function(err, result){
				if(err){
					logger.error(err.code+": "+err.message);
					connection.release();
					return callback(err, null);
				}
				connection.release();  //释放连接（连接释放掉后，可用，不需要重新连接），否则mysql wait_timeout（默认8小时）自动断开连接
				// 如果是DML操作，result返回操作信息，result.insertId是mysql的主键值
				// 如果是查询操作，result返回查询结果
				callback(null, result); // result是json信息，callback是在连接释放后执行的
			});
		});
	};
	
	/**
	 * sqls = [{sql:"", sqlParam:[]}]
	 * callback是commit提交后的信息
	 * sqlback是每一个DML语句执行后的信息
	 * */
	this.batch = function(sqls, callback, sqlback){
		this.pool.getConnection(function(err, connection){
			connection.beginTransaction(function(err){
				if(err){
					logger.error(err.code+": "+err.message);
					connection.release();
					return callback(err,null);
				}
				var funcs = [];
				sqls.forEach(function(info){  //sqls是数组，forEach可以解决for(var i=0; i<sqls.length; i++)中i的闭包问题
					var func = function(cb){
						connection.query(info.sql, info.sqlParam, function(err, result){
							if(err){
								if(cb) cb(err, null);
							}else{
								if(cb) cb(null, result);
							}
						});
					};
					funcs.push(func);
				});
				// 顺序执行函数数组，有点像java的concurrent， 这里的result就是cb(null, result)中的result;err是cb(err, null);中的err
				// 传入的func只有一个callback参数，顺序执行所有的func；如果有err，则不执行其余func，转而回调；如果无err，顺序执行所有func，再回调
				async.series(funcs, function(err, result){
					if(err){
						connection.rollback(function(){
							logger.error(err.code+": "+err.message);
							connection.release();
							return callback(err, null);
						});
					}else{
						connection.commit(function(err, info){  // info是commit的信息
							//logger.info("transaction info: " +JSON.stringify(info));
							if(err){
								connection.rollback(function(){
									logger.error(err.code+": "+err.message);
									connection.release();
									return callback(err, null);
								});
							}else{
								connection.release();
								return callback(null, info);
							}
						});
						if(sqlback) sqlback(err, result);
					}
				});
			});
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
	host     : param.mysqlCon.host,
	user     : param.mysqlCon.user,
	password : param.mysqlCon.password,
	port     : "3306",
	database : param.mysqlCon.database,
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
