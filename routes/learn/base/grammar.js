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

testFlag();
console.info('--------------------');
testSplice();