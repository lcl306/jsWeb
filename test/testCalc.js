var calc = require('../routes/component/util/calc');
var assert = require('assert');

/**
assert如果不满足，将中断进程，并抛出异常
*/
function testAdd(){
	assert.equal(calc.add(12,12.3), 24.3);
	assert.deepEqual(calc.add(12,12), 24);
	assert.strictEqual(calc.add(12.236,12.1), 24.336);
	assert.equal(calc.add(12.235,12), 24.235);
	assert.equal(calc.add(null,12.23), 12.23);
	assert.equal(calc.add(0,null), 0);
	assert.equal(calc.add(null,null), 0);
	assert.equal(calc.add(12.236,-12.1), 0.136);
	assert.equal(calc.add(-12.235,12), -0.235);
	assert.equal(calc.add(-12.235,-1), -13.235);
}

function testSub(){
	assert.equal(calc.sub(12,12.3), -0.3);
	assert.equal(calc.sub(12,12), 0);
	assert.equal(calc.sub(12.236,12.1), 0.136);
	assert.equal(calc.sub(12.236,14.1), -1.864);
	assert.equal(calc.sub(12.235,12), 0.235);
	assert.equal(calc.sub(null,12.23), -12.23);
	assert.equal(calc.sub(0,null), 0);
	assert.equal(calc.sub(null,null), 0);
	assert.equal(calc.sub(12.236,-12.1), 24.336);
	assert.equal(calc.sub(-12.235,12), -24.235);
	assert.equal(calc.sub(-12.235,-12), -0.235);
}

function testDiv(){
	assert.equal(calc.div(12,12.3,2), 0.98);
	assert.equal(calc.div(12,12), 1);
	assert.equal(calc.div(12.236,12.1,8), 1.01123967);
	assert.equal(calc.div(12.236,14.1,1), 0.9);
	assert.equal(calc.div(12.235,12,0), 1);
	assert.strictEqual(calc.div(12.235,12), 1.0195833333333333);
	assert.equal(calc.div(null,12.23,1), 0.0);
	console.info(calc.div(0,null,1));
	console.info(calc.div(null,null,1));
	assert.equal(calc.div(12.236,-12.1,2), -1.01);
	assert.equal(calc.div(-12.235,12,1), -1.0);
	assert.equal(calc.div(-12.235,-12,2), 1.02);
}

function testMulti(){
	assert.equal(calc.multi(12,12.3,2), 147.60);
	assert.strictEqual(calc.multi(12,12), 144);
	assert.strictEqual(calc.multi(12.236,12.1,8), "148.05560000");
	assert.equal(calc.multi(12.236,14.1,1), 172.5);
	assert.equal(calc.multi(12.235,12,0), 147);
	assert.equal(calc.multi(12.235,12), 146.82);
	assert.equal(calc.multi(null,12.23,1), 0.0);
	assert.equal(calc.multi(0,null,1), 0.0);
	assert.equal(calc.multi(null,null,1),0.0);
	assert.equal(calc.multi(12.236,-12.1,2), -148.06);
	assert.equal(calc.multi(-12.235,12,1), -146.8);
	assert.equal(calc.multi(-12.235,-12), 146.82);
}

testAdd();
testSub();
testDiv();
testMulti();