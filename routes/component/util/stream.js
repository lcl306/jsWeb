var fs = require('fs');

var txtType = 'octet-stream';

var excelType = 'msexcel';

var pdfType = 'pdf';

var outStream = function(req, res, filename, code, type){
	var fnames = filename.split('/');
	var fname = fnames[fnames.length-1];
	res.setHeader('Content-Type', 'application/'+type+'; charset='+code);
	if(type!=pdfType){
		var userAgent = (req.headers['user-agent']||'').toLowerCase();
		if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
			res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(fname));
		} else if(userAgent.indexOf('firefox') >= 0) {
			res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(fname)+'"');
		} else {
			/* safari等其他非主流浏览器只能自求多福了 */
			res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(fname).toString('binary'));
		}
	}
	var reader = fs.createReadStream(filename);
	//pipe是异步的，并不会阻塞nodejs的线程， request('http://google.com/doodle.png').pipe(res)
	reader.pipe(res);
};

var outExcel = function(req, res, filename, code){
	outStream(req, res, filename, code, excelType);
};

var outTxt = function(req, res, filename, code){
	outStream(req, res, filename, code, txtType);
};

var outPdf = function(req, res, filename, code){
	outStream(req, res, filename, code, pdfType);
};

exports.outExcel = outExcel;
exports.outTxt = outTxt;
exports.outPdf = outPdf;