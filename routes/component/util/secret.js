var crypto = require('crypto');

function sign(val, seed){
	var algorithm = 'sha256' //其它算法：sha1 sha224 sha256 sha384 sha512 md5
	var digest = 'base64'; //其它：hex
	return crypto.createHmac('sha256', seed).update(val).digest('base64');
}

exports.sign = sign;
