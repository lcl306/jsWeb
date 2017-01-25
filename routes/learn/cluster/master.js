/**
D:\curl7\src\curl 127.0.0.1:8000
*/
var cluster = require("cluster");
var cpus = require("os").cpus();

/**
cluster模块中负载均衡的策略：
	cluster.schedulingPolicy = cluster.SCHED_RR     //开启Round-Robin（轮叫调度）：master接收连接，依次分发给子进程，每次分发给第i=(i+1) mod n子进程；适合IO密集型应用
	cluster.schedulingPolicy = cluster.SCHED_NONE   //关闭Round-Robin，采用进程抢占cpu的方式，适合cpu密集型应用
*/
cluster.schedulingPolicy = cluster.SCHED_RR;
cluster.setupMaster({
	exec: "worker.js"
});

/**
cluster是net和child_process的组合，fork时，将tcpServer的socket的文件描述符发送给worker，worker进程的环境变量包含NODE_UNIQUE_ID，worker listening后拿到socket的文件描述符
*/
for(var i=0; i<cpus.length; i++){
	cluster.fork();
}

cluster.on("setup", function(option){
	console.info("-------------------------------");
	console.info(option);
});

cluster.on("fork", function(worker){
	console.info("fork worker, pid="+worker.process.pid);
});

/**
fork后，worker会发送一条信息给cluster，触发cluster的online事件
*/
cluster.on("online", function(worker){
	console.info("worker online, pid="+worker.process.pid);
});

/**
online后，worker开启监听端口，发送一条消息给cluster，触发cluster的listening事件
*/
cluster.on("listening", function(worker, listenInfo){
	console.info("worker is listening, pid="+worker.process.pid+", port is "+listenInfo.port);
});

/**
worker和cluster的IPC通道断开，触发该事件
如果worker抛出error：throw new Error('throw exception'); worker会触发disconnect事件 和 cluster会kill该worker，该worker触发exit事件
*/
cluster.on("disconnect", function(worker){
	console.error("worker disconnected, pid="+worker.process.pid);
	cluster.fork();  //自动重启worker
});

/**
worker退出，触发该事件
*/
cluster.on("exit", function(worker, code, signal){
	console.info("worker, pid=" +worker.process.pid+" died, exit code is "+code);
});