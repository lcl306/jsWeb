var Q = require('q');

var func1 = function(){
	var defer = Q.defer();
	console.info("func1 start");
	var arr = [];
	arr.push("func1 resolve... ");
	defer.resolve(arr);
	console.info("func1 end");
	return defer.promise;
};

var func2 = function(arr){
	var defer = Q.defer();
	setTimeout(()=>{
		console.info("func2 start");
		arr.push("func2 resolve... ");
		defer.resolve(arr);
		console.info("func2 end");
	},3000);
	return defer.promise;
};

var func3 = function(arr){
	var defer = Q.defer();
	setTimeout(()=>{
		console.info("func3 start");
		arr.push("func3 resolve... ");
		defer.resolve(arr);
		console.info("func3 end");
	},1000);
	return defer.promise;
};

function main(){
	func1().then(func2).then(func3).done(
		(value)=>{
			var info = "";
			value.forEach((v)=>{
				info += v;
			});
			console.info(info);
		},
		(err)=>{
			console.error(err);
		}
	);
}

main();