function str2buf(){
	var str = "人空手2r3热歌";
	var buf = new Buffer(str, "utf-8");
	console.info(buf);
	console.info(buf.length);
}

function cBuf(){
	var buf = new Buffer(100);
	console.info(buf[10]);
	buf[10] = 255;   //最大255
	console.info(buf[10]);
	buf[10] = -1;    //从255开始减
	console.info(buf[10]);
	buf[10] = 257;    //257-256
	console.info(buf[10]);
	buf[10] = 3.77;    //舍掉小数位数
	console.info(buf[10]);
	buf[10] = '人';    //非数字，都是0
	console.info(buf[10]);
	buf.write('非哥委外ere', 2, 20, 'utf-8');  //offset=2，length=20
	console.info(buf);
	console.info(Buffer.isEncoding("GBK"));  //不支持GBK编码
	console.info(Buffer.isEncoding("utf-8")); //支持utf-8
}

str2buf();
cBuf();