var express = require('express');
var router = express.Router();
var logger = require('./util/logger').logger;

//app.js中：var bmaps = require('./routes/bmap'); app.use('/bmap', bmaps); router.get的根目录是/bmap
router.get("/", function(req, res, next){
	res.render("bmap/bmap-marker", {});
	//next()  执行注册到app(通过app.use)的下一个function(req, res, next)，如果没有next()，则链接终止
});

router.post("/get_datas", function(req, res, next){
	//不能用console.debug()进行调试,console.log可以
	//console.log("aaa");
	var datas = [];
	var shop1 = {pix:{x:121.50, y:31.22},title:{label:"店铺：",val:"店1"},detail:[{mount:{label:"总金额",val:2143.33},remark:{label:"注释",val:"旗舰店"}},{mount:{label:"总金额",val:13568.33},remark:{label:"注释",val:"旗舰店"}}]};
	var shop3 = {pix:{x:121.52, y:31.02},title:{label:"店铺：",val:"店3"},detail:[{mount:{label:"总金额",val:1235.33},remark:{label:"注释",val:"环城店"}}]};
	var shop2 = {pix:{x:116.403694, y:39.927552},title:{label:"店铺：",val:"店2"},detail:[{mount:{label:"总金额",val:21.32},remark:{label:"注释",val:"卫星店"}}]};
	var shop4 = {pix:{x:116.413694, y:39.927552},title:{label:"店铺：",val:"店4"},detail:[{mount:{label:"总金额",val:123.32},remark:{label:"注释",val:"卫星店"}}]};
	datas.push(shop1);
	datas.push(shop2);
	datas.push(shop3);
	datas.push(shop4);
	//logger.debug("[%s]aaa[%d]","bbb",98754321);
	//throw new Error('something wrong here');  //可以被domain截获
	res.status(200).json(datas);
});
// express中，默认module.exports={}, exports=module.exports
// 如果需要导出类，使用module.exports=xxx，如果需要导出方法，使用exports.xxx=xxx
module.exports = router;