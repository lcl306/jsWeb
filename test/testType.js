var type = require("../routes/component/util/type");

var testType = function(){
	console.info("isNumber="+type.isNumber(123.23));
	console.info("isString="+type.isString("aaa"));
	console.info("isArray="+type.isArray([]));
	console.info("isFunction="+type.isFunction(function(){
		return "bbb";
	}));
}

exports.testType = testType;