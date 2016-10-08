var express = require('express');
var router = express.Router();
var logger = require('./util/logger').logger;
var JsonParse = require('./util/JsonParse');
var db = require('./util/mysqlConnect');

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
	save(rtn);
	res.status(200).json(ok());
});

function ok(){
	return JSON.stringify({message:"ok"});
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
 * 
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
 * 
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
 * 
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
 * 
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
 * 
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
	db.pool.getConnection(function(err, connection){
		db.openTrans(connection);
		var sql = "delete from shop_info where shop_id = ?";
		var sqlParam = [-1];
		db.trans(connection, sql, sqlParam, function(result){
			logger.info("del info ", result);
		});
		sql = "insert into shop_info(shop_info_id, shop_id, shop_nm, info_label, info_val, create_date) values(nextval('id'), -1, ?, 'gee', 'geee', now())";
		sqlParam = [data.title.val];
		db.trans(connection, sql, sqlParam, function(result){
			logger.info("insert info ", result);
		});
		sql = "insert into shop_info(shop_info_id, shop_id, shop_nm, info_label, info_val, create_date) values(nextval('id'), -1, ?, 'gee2', 'geee2', now())";
		sqlParam = [data.title.val];
		db.trans(connection, sql, sqlParam);
		sql = "call ex_shop_info(?, @ExtReturnVal);";
		db.trans(connection, sql, sqlParam, function(result){
			logger.info("call info: ", result);
		});
		db.release(connection,true);
	});

	var sql = "select * from shop_info i";
	db.query(sql, function(result){
		console.info(result);
		/*for(var p in result){
			logger.info(result[p].shop_nm+"---"+result[p].shop_id);
		}*/
	});
}

module.exports = router;