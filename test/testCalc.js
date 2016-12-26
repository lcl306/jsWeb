var calc = require('../routes/component/util/calc');

function testAdd(){
	console.info(calc.add(12,12.3));
	console.info(calc.add(12,12));
	console.info(calc.add(12.236,12.1));
	console.info(calc.add(12.235,12));
	console.info(calc.add(null,12.23));
	console.info(calc.add(0,null));
	console.info(calc.add(null,null));
	console.info(calc.add(12.236,-12.1));
	console.info(calc.add(-12.235,12));
	console.info(calc.add(-12.235,-1));
}

function testSub(){
	console.info(calc.sub(12,12.3));
	console.info(calc.sub(12,12));
	console.info(calc.sub(12.236,12.1));
	console.info(calc.sub(12.236,14.1));
	console.info(calc.sub(12.235,12));
	console.info(calc.sub(null,12.23));
	console.info(calc.sub(0,null));
	console.info(calc.sub(null,null));
	console.info(calc.sub(12.236,-12.1));
	console.info(calc.sub(-12.235,12));
	console.info(calc.sub(-12.235,-12));
}

function testDiv(){
	console.info(calc.div(12,12.3,2));
	console.info(calc.div(12,12));
	console.info(calc.div(12.236,12.1,8));
	console.info(calc.div(12.236,14.1,1));
	console.info(calc.div(12.235,12,0));
	console.info(calc.div(12.235,12));
	console.info(calc.div(null,12.23,1));
	console.info(calc.div(0,null,1));
	console.info(calc.div(null,null,1));
	console.info(calc.div(12.236,-12.1,2));
	console.info(calc.div(-12.235,12,1));
	console.info(calc.div(-12.235,-12,2));
}

function testMulti(){
	console.info(calc.multi(12,12.3,2));
	console.info(calc.multi(12,12));
	console.info(calc.multi(12.236,12.1,8));
	console.info(calc.multi(12.236,14.1,1));
	console.info(calc.multi(12.235,12,0));
	console.info(calc.multi(12.235,12));
	console.info(calc.multi(null,12.23,1));
	console.info(calc.multi(0,null,1));
	console.info(calc.multi(null,null,1));
	console.info(calc.multi(12.236,-12.1,2));
	console.info(calc.multi(-12.235,12,1));
	console.info(calc.multi(-12.235,-12));
}

function testFlag(){
	var b;
	var d = "item";
	var a = a || b || "value";  //b必须是真实存在的变量，虽然可以是undefined
	console.info(b);
	console.info(a);
	var c = d === "item";
	console.info(c);
}

function testSplice(){
	var a = [15,43,575,8686,34];
	a.splice(2,1);
	console.info(a);
}

testAdd();
console.info('--------------------');
testSub();
console.info('--------------------');
testDiv();
console.info('--------------------');
testMulti();
console.info('--------------------');
testFlag();
console.info('--------------------');
testSplice();