var assert = require('assert');
var fs = require('fs');
var code = require('./mockCode');

describe('mockCode#getConent', function(){
	var _readFile;
	
	//如果有多个it方法，每次执行it方法前都使用，before只在第一次it方法执行前使用
	beforeEach(function(){
		_readFile = fs.readFile;
		fs.readFile = function(filename, encoding, callback){
			//模拟异步行为
			process.nextTick(function(){
				callback("mock readFile error");
			});
		};
	});
	
	it("mock模拟readFile，产生错误,是否获得err对象", function(done){
		code.getContent('./mock.js', function(err, data){
			assert.ok(err);
			done();
		});
	});
	
	//如果有多个it方法，每次执行it方法后都使用，after只在最后一次it方法执行后使用
	afterEach(function(){
		fs.readFile = _readFile;
	});
});


