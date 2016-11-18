/***
socket事件
connect：连接成功
connecting：正在连接
disconnect：断开连接
connect_failed：连接失败
error：错误发生，并且无法被其他事件类型所处理
reconnect_failed：重连失败
reconnect：成功重连
reconnecting：正在重连
*/
var defSocketUrl = window.location.protocol+'//'+window.location.host+'/chat';
var Chater = function(url){
	this.socketUrl = url?url:defSocketUrl;	
	this.socket = io.connect(this.socketUrl);
	this.socket.on('connect', function (data) {
		console.log(data);  
	});
	this.socket.on('newer', function(data){
		console.info(data);
	});
	this.uin = false;
	this.send = function(from, to, msg, logoutBack){
		if(this.uin){
			this.socket.emit('say',from,to,msg);
	    }else if(logoutBack){
	    	logoutBack(from);
	    }
	};
	this.login = function(from, onback){
		if(!this.uin){
			this.socket.emit('login',from);
		    if(!this.socket.onFrom){
		    	this.socket.on(from, function (data) {
		    		onback(data);
			    });
			    this.socket.onFrom = true;
		    }
		    this.uin = true;
	    }
	};
	this.logout = function(from){
		if(this.uin){
			this.socket.emit('logout', from);
			this.uin =false;
		}
	};
};