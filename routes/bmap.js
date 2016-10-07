var express = require('express');
var router = express.Router();
var logger = require('./util/logger').logger;
var JsonParse = require('./util/JsonParse');

//app.js中：var bmaps = require('./routes/bmap'); app.use('/bmap', bmaps); router.get的根目录是/bmap
router.get("/", function(req, res, next){
	res.render("bmap/bmap-marker", {});
	//next()  执行注册到app(通过app.use)的下一个function(req, res, next)，如果没有next()，则链接终止
});

router.post("/get_datas", function(req, res, next){
	//不能用console.debug()进行调试,console.info可以
	//console.info("aaa");
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

router.post("/save_shop", function(req,res,next){
	var shop = req.body;  //body已经是json对象
	console.info(shop);
	for(var p in shop){   //如果shop是数组，则p为数组下标，获得的是一个对象；如果shop是对象，p为对象属性
		console.log(shop[p]);
	}
	res.status(200).json(ok());
});

router.post("/save_data", function(req,res,next){
	var jsonParse = new JsonParse();
	var data = req.body;
	var rtn = {};
	//var preIdx = "";
	for(var p in data){
		var props = jsonParse.parseProp(p);
		if(props[0]!="detail"){
			jsonParse.setTwigLeaf(rtn, props[0], props[1], data[p]);
		}else if(props[0]=="detail"){
			var branch = jsonParse.setTwigs(rtn, props[0], props[1]);
			jsonParse.setTwigLeaf(branch, props[2], props[3], data[p]);
			//preIdx = props[1];
		}
	}
	console.info(rtn.detail[0].mount.val);
	res.status(200).json(ok());
});

function ok(){
	return JSON.stringify({message:"ok"});
}

module.exports = router;