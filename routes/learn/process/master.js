var cp = require('child_process');
var cpus = require('os').cpus();

var spawn = cp.spawn;		   //启动子进程，执行命令，没有timeout
var exec = cp.exec;            //启动子进程，执行命令，有callback，可设置timeout
var execFile = cp.execFile;    //启动子进程，执行文件，有callback，可设置timeout
var fork = cp.fork;			   //启动子进程，执行文件

var server = require('net').createServer();

function workerFork(){
	for(var i=0; i<cpus.length; i++){
		//父进程（master）在创建子进程（worker）之前，会创建IPC管道来监听它，并通过环境变量（NODE_CHANNEL_FD）告诉子进程这个IPC管道的文件描述符
		//只有子进程是node时，子进程才能连接IPC管道
		var w = fork('./worker.js');        
		w.on('message', function(m){		//master通过 on('message')接收消息
			console.info("get message from worker: ", m);
		});
		w.send({message:"master send message"});	//master通过send发送消息
	}
}

function workerHttpFork(){
	server.listen(1337, function(){
		for(var i=0; i<cpus.length; i++){
			fork('./workerHttp.js').send('server', server);  //父进程（master）将所有的句柄发送给工作进程（workerHttp），后关闭监听
		}
		server.close();
	});
}

function workerTcpFork(){
	server.on('connection', function(socket){
		socket.end('handle by master\n');
	});
	server.listen(1337, function(){
		for(var i=0; i<cpus.length; i++){
			//tcpServer、httpServer、tcpSocket、udpSocket句柄也可以send
			//句柄send：实际上发送了一个message.cmd值为NODE_HANDLE的信息，通过message.type、进程的文件描述符，还原出相应的对象
			//由于进程的文件描述符相同，所以每个子进程还原出的对象的port也相同，达到共同监听的目的，但同一时间，文件描述符只能被某个子进程使用；换言之，某一时刻只有一个子进程能抢到连接，服务发送过来的网络请求
			fork('./workerTcp.js').send('server', server);   
		}
		server.close();
	});
}

function workerSpawn(){
	for(var i=0; i<cpus.length; i++){
		spawn('node', ['./worker.js']);
	}
}

function workerExec(){
	for(var i=0; i<cpus.length; i++){
		exec('node worker.js', function(err, stdout, stderr){
			console.info(stdout);
		});
	}
}

function workerExecFile(){
	for(var i=0; i<cpus.length; i++){
		execFile('worker.js', function(err, stdout, stderr){
			console.info(stdout);
		});
	}
}

workerHttpFork();
//workerTcpFork();
//workerFork();
//workerSpawn();
//workerExec();
//workerExecFile();