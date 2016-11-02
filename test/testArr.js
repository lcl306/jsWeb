var arr = require("../routes/component/util/arr");

function testRemove(){
	var a = ["人", "个", "各位"];
	arr.remove(a, "个");
	arr.remove(a, "改为");
	arr.remove(a, "各位");
	console.info(a);
}

testRemove();