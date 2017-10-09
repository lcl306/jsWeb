var fs = require("fs");
var path = require('path');
var archiver = require("archiver");

function zip(target, dir, file){
	var output = fs.createWriteStream(target);
	var archive = archiver('zip');
	archive.on('error', function(err){
		throw err;
	});
	archive.pipe(output);
	var files = fs.readdirSync(dir);
	files.forEach(function(f){
	    if(file && file==f){
	    	archive.append(fs.createReadStream(dir+"/"+f), {name:f});
	    }else if(!file && f!=path.basename(target)){
	    	archive.append(fs.createReadStream(dir+"/"+f), {name:f});
	    }   
	});
	archive.finalize();
}

exports.zip = zip;