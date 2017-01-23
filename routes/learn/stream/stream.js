var fs = require('fs');

function copy(inName, outName){
	var reader = fs.createReadStream(inName);
	var writer = fs.createWriteStream(outName);
	reader.on('data', function(chunk){
		writer.write(chunk);
	});
	reader.on('end', function(){
		writer.end();
	});
}

function simpleCopy(inName, outName){
	var reader = fs.createReadStream(inName);
	var writer = fs.createWriteStream(outName);
	reader.pipe(writer);
}

copy('testType.js', 'testTypeCopy.js');
simpleCopy('testType.js', 'testTypeCopy.js');
