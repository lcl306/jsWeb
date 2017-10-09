/**
	1）本模块模拟了nodejs中cluster模块的内容，如果用到多进程管理，请使用cluster模块
	2）子进程状态共享，放入redies或磁盘文件的数据，如果在子进程中有copy，则该数据如果变化，子进程的copy也要变化
	      可以用一个单独的进程，通过tcp或udp的方式和子进程进行联系，操作redies或磁盘中的共享数据，再通知其它子进程的copy，做相应的变化
*/
var fork = require("child_process").fork;
var cpus = require("os").cpus();
var logger = require('../register/logger').logger;

var server = require("net").createServer();
server.listen(1337);

var workers={};
var workerName = "../../../test/worker.js";

var RESTART_LIMIT = 10;			//重启次数限制
var RESTART_DURING = 6000;		//重启次数（如10次）的最长时间
var restart=[];

//如果在RESTART_DURING时间内，重启次数大于10次，说明重启太频繁
function tooFrequently(){
	var time = Date.now();
	var length = restart.push(time);
	if(length > RESTART_LIMIT){
		restart = restart.slice(RESTART_LIMIT* -1);  //如果重启次数大于10次，取最后10条记录
	}
	return restart.length>=RESTART_LIMIT && restart[restart.length-1]-restart[0] < RESTART_DURING;
}

function createWorker(){
	//如果重启太频繁，不再重启，并且触发giveup事件，giveup事件比uncaughtException更严重，因为没有服务可用，应添加重要日志
	if(tooFrequently()){
		process.emit("giveup", RESTART_LIMIT, RESTART_DURING);
		logger.error("---------------too frequently start!!!-----------------");
		return;
	}
	var worker = fork(workerName);
	worker.on("message", function(m){
		if(m.act=='suicide'){		//收到process的自杀信号后，master创建新worker，然后server断开所有连接，process再exit
			createWorker();
		}
	});
	worker.on("exit", function(code, signal){                  //正常退出、或kill时触发，code为退出码（一般为0或1），signal为kill时的信号（正常退出没有）
		logger.info("worker pid=" +worker.pid+" exit");
		delete workers[worker.pid];
	});
	worker.send("server", server);
	workers[worker.pid]=worker;
	logger.info("worker pid="+worker.pid+" create");
}

//master自己退出时，所有的worker都应该退出
process.on("exit", function(){
	for(var pid in workers){
		workers[pid].kill();
	}
});

for(var i=0; i<cpus.length; i++){
	createWorker();
}