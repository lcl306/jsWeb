
/**
npm --save install benchmark
*/
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

var arr = [0,1,2,3,5,6];
var callback = function(item){
	return item;
}

/**
比较方法nativeMap和customMap的执行速度
add：第一个参数是否方法名，第二个参数是方法；使用相同的测试arr和回调函数
cycle：在每一个add的方法执行完成后，触发

benchmark对测试有严密的抽样过程。执行多少次方法取决于，采样到的数据能否完成统计。
83 runs sampled表示nativeMap测试的过程中有83个样本，4.14%是样本的方差
*/
suite.add('nativeMap', function(){
	return arr.map(callback);
}).add('customMap', function(){
	var rtn = [];
	for(var i=0; i<arr.length; i++){
		rtn.push(callback(arr[i]));
	}
	return rtn;
}).on('cycle', function(event){
	console.info(String(event.target));
}).on('complete', function(){
	console.info('Fastest is '+this.filter('fastest')['0'].name);
}).run();