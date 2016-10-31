var fmDate = require("../routes/component/util/fmDate");

function testMonth(){
	console.info(fmDate.format(fmDate.add("2016-10-20", "m", 2),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-10-20", "m", 3),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-10-20", "m", -1),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-10-20", "m", -10),"yyyy-MM-dd"));
}

function testDay(){
	console.info(fmDate.format(fmDate.add("2016-12-20", "d", 2),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-10-20", "d", 20),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-10-20", "d", -1),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-10-20", "d", -20),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-12-31", "d", 1),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2017-01-01", "d", -1),"yyyy-MM-dd"));
}

function testYear(){
	console.info(fmDate.format(fmDate.add("2016-12-20", "y", 2),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-10-20", "y", 20),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-10-20", "y", -1),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-10-20", "y", -20),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2016-12-31", "y", 1),"yyyy-MM-dd"));
	console.info(fmDate.format(fmDate.add("2017-01-01", "y", -1),"yyyy-MM-dd"));
}

testMonth();
console.info("--------------------------------");
testDay();
console.info("--------------------------------");
testYear();
