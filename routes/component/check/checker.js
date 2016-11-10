var type = require("../util/type");
var message = require("./message");
var chk = require("./baseCheck");


function spell(message, parts){
	if(parts || parts==0){
		if(type.isArray(parts)){
			parts.forEach(function(part){
				message = message.replace("%", part);
			});
		}else{
			message = message.replace("%", parts);
		}
	}
	return message+"\r\n";
}
	
/**
 * params = {e:true,n:true,f:10}  e是否非空，n是数值，f是位数，fd是小数位数，fi是整数位数
 * */
function check(word, name, params){
	var result = {pass:true,message:''};
	for(var p in params){
		switch(p){
		case 'e':
			var r = chk.notEmpty(word);
			if(!r.pass){
				result.pass = false;
				result.message += spell(name+message.noEmpty);
			}
			break;
		case 'f':
			var r = chk.overFigure(word, params[p]);
			if(!r.pass){
				result.pass = false;
				result.message += spell(name+message.noFigure, r.part);
			}
			break;
		case 'fi':
			var r = chk.overIntFigure(word, params[p]);
			if(!r.pass){
				result.pass = false;
				result.message += spell(name+message.noIntFigure, r.part);
			}
			break;
		case 'fd':
			var r = chk.overDotFigure(word, params[p]);
			if(!r.pass){
				result.pass = false;
				result.message += spell(name+message.noDotFigure, r.part);
			}
			break;
		case 'n':
			var r = chk.isNum(word);
			if(!r.pass){
				result.pass = false;
				result.message += spell(name+message.noNum);
			}
			break;
		}
	}
	var r = chk.isWord(word);
	if(!r.pass){
		result.pass = false;
		result.message += spell(name+message.noChar, r.part);
	}
	return result;
}

exports.check = check;