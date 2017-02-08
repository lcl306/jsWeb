/**
npm -g install mocha
mocha ./first.js > reportFirst.txt
*/
var assert = require("assert");
var fs = require('fs');

describe('Array', function(){
	describe("#indexOf()", function(){
		it('如果不存在，返回-1', function(){
			assert.equal([1,2,3].indexOf(4), -1);
		});
	});
});

describe('fs', function(){
	describe('#readFile()', function(){
		this.timeout(1000);  //默认异步done的超时时间2000ms
		it('如果不存在，出现error', function(done){
			fs.readFile('./aa.js', 'utf-8', function(err, data){
				assert.ok(err);  //判断是否为true，如果readFile是./first.js，err为null，则不ok
				done();  //因为fs.readFile是异步操作，必须执行done
			});
		});
	});
});

