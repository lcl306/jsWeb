

function memory(){
	var mem = process.memoryUsage();
	var format = function (bytes) {
	return (bytes / 1024 / 1024).toFixed(2) + ' MB';
	};
	console.log('Process: heapTotal ' + format(mem.heapTotal) +
	' \theapUsed ' + format(mem.heapUsed) + ' \trss ' + format(mem.rss));
	console.log('-----------------------------------------------------------');
}

memory();


