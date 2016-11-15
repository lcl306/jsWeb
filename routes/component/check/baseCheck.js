var type = require("../util/type");
var noChars = ["'","\\"];

function isWord(word){
	var result ={pass:true};
	noChars.forEach(function(c){
		if(type.isString(word) && word.indexOf(c)!=-1){
			result.pass = false;
			if(!result.part) result.part = '';
			result.part += (","+c);
		}
	});
	if(result.part) result.part = result.part.substring(1);
	return result;
}

function overFigure(word, figure){
	var result={pass:true};
	if(typeof word != 'undefined'){
		word = word+'';
		if(word.length>figure){
			result.pass = false;
			result.part = figure;
		}
	}
	return result;
}

function overIntFigure(word, figure){
	var result={pass:true};
	if(word){
		if(type.isString(word)){
			var part = word.split(".")[0];
			if(part.charAt(0)=='-') part = part.substring(1);
			result = overFigure(part, figure);
		}else if(type.isNumber(word)){
			result = overFigure(Math.abs(Math.floor(word)), figure);
		}
	}
	return result;
}

function overDotFigure(word, figure){
	var result={pass:true};
	if(word){
		word = word+"";
		var parts = word.split(".");
		if(parts.length>1){
			result = overFigure(parts[parts.length-1], figure);
		}
	}
	return result;
}

function notEmpty(word){
	var result={pass:true};
	if(typeof word =='undefined' || word==null || type.isString(word) && word.trim()==''){
		result.pass = false;
	}
	return result;
}

function isNum(word){
	var result={pass:true};
	if(word && isNaN(word)){
		result.pass = false;
	}
	return result;
}

exports.isWord = isWord;
exports.overFigure = overFigure;
exports.overIntFigure = overIntFigure;
exports.overDotFigure = overDotFigure;
exports.notEmpty = notEmpty;
exports.isNum = isNum;