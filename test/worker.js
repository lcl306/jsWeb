var Worker = require("../routes/component/cluster/BaseWorker");

new Worker(require('http').createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('handled by child, pid is ' + process.pid + '\n');
	throw new Error('throw exception');
}));



