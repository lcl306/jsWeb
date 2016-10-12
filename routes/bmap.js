var express = require('express');
var router = express.Router();
var logger = require('./util/logger').logger;
var JsonParse = require('./util/JsonParse');
var db = require('./util/mysqlConnect');
var dbClient = require('./util/mongoConnect').dbClient;
var bmapUtil = require("./bmap-util");


//app.js中：var bmaps = require('./routes/bmap'); app.use('/bmap', bmaps); router.get的根目录是/bmap
router.get("/", function(req, res, next){
	dbClient.connect(function(err, db){
		if(!err){
			var col = db.collection("shop_info");
			col.find({}).toArray(function(err, result){
				if(!err){
					res.render("bmap/bmap-marker", {result:result});
				}else{
					console.error(err);
				}
			});
		}
	});
	//next()  执行注册到app(通过app.use)的下一个function(req, res, next)，如果没有next()，则链接终止
});

router.get("/edit", function(req,res,next){
	res.render("bmap/bmap-marker-edit",{});
});

router.post("/get_datas", function(req, res, next){
	//不能用console.debug()进行调试,console.info可以
	//console.info("aaa");
	
	//logger.debug("[%s]aaa[%d]","bbb",98754321);
	//throw new Error('something wrong here');  //可以被domain截获
	dbClient.connect(function(err, db){
		if(!err){
			//bmapUtil.mr(db);
			//bmapUtil.grp(db.collection("shop_info"));
			bmapUtil.aggr(db.collection("shop_info"));
			/*db.eval("func_sum_mount()",function(err, result){
				if(!err){
					console.info(result);
				}else{
					console.error(err);
				}
			});*/
		}
	});
	

	dbClient.connect(function(err, db){
		if(!err){
			var col = db.collection("shop_info");
			col.find({}).toArray(function(err, result){
				if(!err){
					res.status(200).json(result);
				}else{
					console.error(err);
				}
			});
		}
	});
});

function getData1(){
	var datas = [];
	var shop1 = {pix:{x:121.50, y:31.22},title:{label:"店铺：",val:"店1"},detail:[{mount:{label:"总金额",val:2143.33},remark:{label:"注释",val:"旗舰店"}},{mount:{label:"总金额",val:13568.33},remark:{label:"注释",val:"旗舰店"}}]};
	var shop3 = {pix:{x:121.52, y:31.02},title:{label:"店铺：",val:"店3"},detail:[{mount:{label:"总金额",val:1235.33},remark:{label:"注释",val:"环城店"}}]};
	var shop2 = {pix:{x:116.403694, y:39.927552},title:{label:"店铺：",val:"店2"},detail:[{mount:{label:"总金额",val:21.32},remark:{label:"注释",val:"卫星店"}}]};
	var shop4 = {pix:{x:116.413694, y:39.927552},title:{label:"店铺：",val:"店4"},detail:[{mount:{label:"总金额",val:123.32},remark:{label:"注释",val:"卫星店"}}]};
	datas.push(shop1);
	datas.push(shop2);
	datas.push(shop3);
	datas.push(shop4);
	return datas;
}

router.post("/save_shop", function(req,res,next){
	var shop = req.body;  //body已经是json对象
	/*console.info(shop);
	for(var p in shop){   //如果shop是数组，则p为数组下标，获得的是一个对象；如果shop是对象，p为对象属性
		console.log(shop[p]);
	}*/
	var data = {pix:{x:shop.lng,y:shop.lat}, title:{label:shop.shop_title,val:shop.shop_nm}};
	dbClient.connect(function(err, db){
		if(!err){
			var col = db.collection("shop_info");
			col.find({"title.val":shop.shop_nm_old}).toArray(function(err, result){
				if(result.length>0){
					col.update({"title.val":shop.shop_nm_old},{$set:{"title.val":data.title.val}});
				}else{
					col.insert(data);
				}
				res.status(200).json(ok());
			});
		}
	});
});

router.post("/del_shop", function(req,res,next){
	var shop = req.body;
	dbClient.connect(function(err, db){
		if(!err){
			db.collection("shop_info").remove({"title.val":shop.shop_nm_old});
			res.status(200).json(ok());
		}
	});
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
	saveSI(rtn);
	res.status(200).json(ok());
});

function ok(){
	return JSON.stringify({message:"ok"});
}

function saveSI(rtn){
	dbClient.connect(function(err, db){
		if(!err){
			var col = db.collection("shop_info");
			//col.remove();
			col.find({"title.val":rtn.title.val},{"detail.mount.val":""}).toArray(function(err, result){
				if(result.length>0){
					col.update({"title.val":rtn.title.val},{$set:{"detail":rtn.detail}}/*, function(err, result){
						console.info(result);
					}*/);
				}else{
					//col.save(rtn, [], function(err, result));
					col.insert(rtn/*, function(err, result){
						console.info("insert");
					}*/);
				}
			});
		}
	});
}

/**
 * 
DROP TABLE IF EXISTS `seq_id`;
CREATE TABLE `seq_id` (
`id`  int(11) UNSIGNED NOT NULL AUTO_INCREMENT ,
`name`  varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=MyISAM
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
AUTO_INCREMENT=53973;

DROP TABLE IF EXISTS `seq_no`;
CREATE TABLE `seq_no` (
`name`  varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
`curr_value`  int(11) NOT NULL ,
`increment`  int(11) NOT NULL DEFAULT 1 ,
`curr_no`  varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL ,
PRIMARY KEY (`name`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci;

DROP FUNCTION IF EXISTS `currval`;
DELIMITER ;;
CREATE FUNCTION `currval`(seq_name VARCHAR(50)) RETURNS varchar(12) CHARSET utf8
    DETERMINISTIC
BEGIN 
   DECLARE value varchar(12) DEFAULT '';
   IF LOCATE('no',seq_name)>0 THEN
			SELECT curr_no INTO value FROM seq_no WHERE name = seq_name;  
	 ELSE
      SELECT id INTO value FROM `seq_id` WHERE name = seq_name;
	 END IF;
   RETURN value;
END
;;
DELIMITER ;

DROP FUNCTION IF EXISTS `nextval`;
DELIMITER ;;
CREATE FUNCTION `nextval`(seq_name VARCHAR(10)) RETURNS varchar(12) CHARSET utf8
    DETERMINISTIC
BEGIN
  DECLARE `value` INTEGER;
   IF LOCATE('no', seq_name)>0 THEN
   SELECT count(*) INTO `value` FROM seq_no WHERE name = seq_name;
   IF `value`=0 THEN
    INSERT INTO seq_no VALUES (seq_name, 0, 1, '');
   END IF;
   UPDATE seq_no SET curr_value = curr_value+increment, curr_no = LPAD(curr_value,10,'0') WHERE name = seq_name;
  ELSE
      DELETE FROM `seq_id` WHERE name=seq_name;
      INSERT INTO `seq_id`(name) VALUES(seq_name);
  END IF;
   RETURN currval(seq_name);
END
;;
DELIMITER ;

CREATE TABLE `shop_info` (
`shop_nm`  varchar(40) NOT NULL ,
`create_date`  datetime NULL ,
`shop_info_id`  bigint NOT NULL AUTO_INCREMENT ,
PRIMARY KEY (`shop_info_id`),
INDEX `idx1` (`shop_nm`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8
;
ALTER TABLE `shop_info`
ADD COLUMN `info_label`  varchar(40) NULL AFTER `shop_info_id`,
ADD COLUMN `info_val`  varchar(100) NULL AFTER `info_label`,
ADD COLUMN `shop_id`  bigint NOT NULL AFTER `info_val`;

DROP PROCEDURE IF EXISTS `ex_shop_info`;
DELIMITER ;;
CREATE PROCEDURE `ex_shop_info`(IN shop_nm VARCHAR(40),OUT ExtReturnVal INT)
TOP: BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
	ROLLBACK;
	SET ExtReturnVal = 0;  -- Failed
END;

START TRANSACTION;
	INSERT INTO shop_info(shop_info_id, shop_id, shop_nm, info_label, info_val, create_date) values(nextval('id'), -1, shop_nm, 'geeCall', 'geee', now());
	SET ExtReturnVal = 1;
	SELECT ExtReturnVal;
	COMMIT;
END
;;
 **/
function save(data){
	var sql1 = {sql:"delete from shop_info where shop_id = ?", sqlParam : [-1]};
	var sql2 = {sql:"insert into shop_info(shop_info_id, shop_id, shop_nm, info_label, info_val, create_date) values(nextval('id'), -1, ?, 'gee', 'geee', now())", sqlParam : [data.title.val]};
	var sql3 = {sql:"insert into shop_info(shop_info_id, shop_id, shop_nm, info_label, info_val, create_date) values(nextval('id'), -1, ?, 'gee2', 'geee2', now())", sqlParam : [data.title.val]};
	//var sql4 = {sql:"call ex_shop_info(?, @ExtReturnVal);", sqlParam : [data.title.val]};
	var sqls = [];
	sqls.push(sql1);
	sqls.push(sql2);
	sqls.push(sql3);
	//sqls.push(sql4);
	db.batch(sqls, function(err, results){
		console.info(results);
		//因为是异步，所有的后续操作，都必须在callback中执行，否则无法取得最新插入的数据
		var sql = "select * from shop_info i";
		db.query(sql, function(err, result){
			for(var p in result){
				logger.info(result[p].shop_nm+"---"+result[p].shop_id+"---"+result[p].shop_info_id);
			}
		});
	},function(err, result){
		console.info(result);
	});	
	
}

module.exports = router;