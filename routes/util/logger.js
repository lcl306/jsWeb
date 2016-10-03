var log4js = require('log4js');

log4js.configure({
	appenders :[
		{type:'console',category:'console'},
		{type:'dateFile',filename:'../logs/log',pattern:'_yyyy-MM-dd',maxLogSize:1024,alwaysIncludePattern:false,backups:4,category:'fileLog'}	
	],
	replaceConsole : true,   //代替console
	levels:{
		fileLog :'debug',    //trace, debug, info, warn, error, fatal
		console :'debug'
	}
});

var logger = log4js.getLogger('console'); //如果需要的话，也可以改成log4js.getLogger('console');
exports.logger = logger;  //使用时var logger = require('./util/logger').logger; logger.debug("aaa");
exports.use = function(app){
	app.use(log4js.connectLogger(logger, {level:'INFO', format:':method :url'}));  //app的级别是info
}
