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

function isExpired(req){
	var expires = getExpires(req);
	if (expires && expires <= Date.now()) {
		return true;
	}
	return false;
}

function getExpires(req){
	var sess = req.session;
	return typeof sess.cookie.expires === 'string'? new Date(sess.cookie.expires): sess.cookie.expires;
}

function isXmlHttp(req){
	return req.headers['x-requested-with']?true:false;
}

function getCookie(req, cookieName){
	try{
		var cookies = cookie.parse(req.headers.cookie);
		return cookies[cookieName];
	}catch(e){
		return null;
	}
} 

module.exports = function sessionFilter(){
	return function(req,res,next){
		console.info(getExpires(req));
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
