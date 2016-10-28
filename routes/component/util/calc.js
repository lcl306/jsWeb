function dotLen(num){
	num = num || 0;
	var a = num.toString().split('.');
	return a.length>1?a[1].length:0;
}

function toInt(num){
	num = num || 0;
	return Number(num.toString().replace(".",""));
}

/**
 * 2个数相加
 * */
function add(num1,num2){
	var m=Math.pow(10,Math.max(dotLen(num1),dotLen(num2))); //需要变成整数的位数
    return Math.round(num1*m+num2*m)/m;
}

/**
 * 2个数相减
 * */
function sub(num1,num2){
    var m=Math.pow(10,Math.max(dotLen(num1),dotLen(num2)));
    return Math.round(num1*m-num2*m)/m;
}

/**
 * 2个数相除
 * */
function div(num1,num2,digit){
	var num =(toInt(num1)/toInt(num2))*Math.pow(10,dotLen(num2)-dotLen(num1));
	if(digit || digit==0) num=num.toFixed(digit);
	return num;
}

/**
 * 2个数相乘
 * */
function multi(num1,num2,digit){
	var num =toInt(num1)*toInt(num2)/Math.pow(10,dotLen(num2)+dotLen(num1));
	if(digit || digit==0) num=num.toFixed(digit);
	return num;
}

exports.add=add;
exports.sub=sub;
exports.div=div;
exports.multi=multi;