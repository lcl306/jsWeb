var db = require("../routes/component/connect/mysqlConnect");

function getShopInfo(){
	var sql = "select * from shop_info";
	db.query(sql, function(err, results){
		console.info(results);
	});

}

getShopInfo();