var logger = require('./logger').logger;

var noLoginPath = ['/index','/login',"/javascripts", "/stylesheets"]; //不需要登陆的地址
var indexPath = "/";


var needLogin = function(path){
	for(var i =0; i< noLoginPath.length;i++){
		var item = noLoginPath[i];
		if(path && path.indexOf(item)!=-1){
			return false; //不需要登陆
		}
	}
	return true;
};

module.exports = function sessionFilter(){
	return function(req,res,next){
		//不能拦截ajax的请求
		var path = req.originalUrl;
		if(needLogin(path) && !req.session.user){
			logger.info("session filter, path: " +path +" session invalid");
			//return req.redirect(indexPath);
		}
		res.on("finish", function(){
			//业务逻辑之后的处理
		});
		next();
	};
};
