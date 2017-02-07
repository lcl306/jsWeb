var fs = require('fs');

exports.getContent = function (filename, callback) {
	fs.readFile(filename, 'utf-8', callback);
};