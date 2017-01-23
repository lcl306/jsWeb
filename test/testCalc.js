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

testAdd();
console.info('--------------------');
testSub();
console.info('--------------------');
testDiv();
console.info('--------------------');
testMulti();
console.info('--------------------');