var io = require('socket.io').listen(3355);
var users = {};
io.sockets.on('connection', function(socket){
	socket.emit('connect', {say:'welcome'});
	socket.on('say', function(from, to, msg){
		if(users[to]) {
			console.info(from+'to'+to+': '+msg);
			users[to].emit(to,{from:from,msg:msg});
		}
	});
	socket.on('login', function(user){
		users[user] = socket;
	});
	socket.on('logout', function(user){
		users[user] = null;
	});
	socket.on('disconnect', function(){
		socket.emit('user disconnected');
	});
});