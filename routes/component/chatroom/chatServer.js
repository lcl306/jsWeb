var logger = require('../register/logger').logger;
//自主使用
/*var io = require('socket.io').listen(3355);  
io.of('/chart').on('connection', function(socket){  //connection为基础事件,io.sockets.on的目录是‘/’
	chat(socket);
});*/
//绑定http服务器，和express4整合，添加在www文件中
/*require('socket.io').listen(server).of('/chart').on( "connection", function( socket ){
    chatServer.chat(socket);
});*/

var users = {};
function chat(socket){
	socket.emit('connect', {say:'welcome'});
	socket.on('say', function(from, to, msg){
		if(users[to]) {
			logger.info(from+'to'+to+': '+msg);
			users[to].emit(to,{from:from,msg:msg});
		}
	});
	socket.on('login', function(user){
		users[user] = socket;
		socket.user = user;
		logger.info(user+'登录');
		socket.join('member');  //进入登录的房间
		socket.broadcast.emit('newer', user+'登录。');
		socket.broadcast.to('member').emit('newer', '欢迎'+user); //对房间进行广播，不包括自己，如果包括自己用in('member')
		//获取所有房间的信息,key为房间名，value为房间名对应的socket ID数组
		//io.sockets.manager.rooms
		//获取member中的客户端，返回所有在此房间的socket实例
		//io.sockets.clients('member')
		//通过socket.id来获取此socket进入的房间信息
		//io.sockets.manager.roomClients[socket.id]
	});
	socket.on('logout', function(user){
		delete users[user];  //删除js对象的属性
		socket.leave('member');
		logger.info(user+'登出');
	});
	socket.on('disconnect', function(msg){  //disconnect为基础事件，socket失去连接时触发（包括关闭浏览器，主动断开，掉线等任何断开连接的情况）
		if(users[socket.user]) delete users[socket.user];
		socket.leave('member');
		logger.info(socket.user+'socket关闭');
	});
}

exports.chat = chat;