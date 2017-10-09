var row2json = require("row2json");

testRow2json()

function testRow2json(){
	var market_sales=[];
	var s1={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:1,year_month:"201610",
	        sign_satuts_id:11,sign_status_nm:"已签约",dict_id:21,dict_type:'04',dict_type_name:'医院规模', dict_name:'大',item_num:20};
	var s2={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:2,year_month:"201610",
	        sign_satuts_id:11,sign_status_nm:"已签约",dict_id:22,dict_type:'04',dict_type_name:'医院规模', dict_name:'中',item_num:200};
	var s3={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:3,year_month:"201610",
	        sign_satuts_id:11,sign_status_nm:"已签约",dict_id:23,dict_type:'04',dict_type_name:'医院规模', dict_name:'小',item_num:2000};
	var s4={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:4,year_month:"201610",
	        sign_satuts_id:12,sign_status_nm:"未签约",dict_id:21,dict_type:'04',dict_type_name:'医院规模', dict_name:'大',item_num:50};
	var s5={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:5,year_month:"201610",
	        sign_satuts_id:12,sign_status_nm:"未签约",dict_id:22,dict_type:'04',dict_type_name:'医院规模', dict_name:'中',item_num:500};
	var s6={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:6,year_month:"201610",
	        sign_satuts_id:12,sign_status_nm:"未签约",dict_id:23,dict_type:'04',dict_type_name:'医院规模', dict_name:'小',item_num:5000};
	var s7={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:7,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:31,dict_type:'06',dict_type_name:'消费类型', dict_name:'活体',item_num:200000.00};
	var s8={market_id:1,area_id:1,area_nm:null,province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:8,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:32,dict_type:'06',dict_type_name:'消费类型', dict_name:'医疗',item_num:2000000.00};
	var s9={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:9,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:33,dict_type:'06',dict_type_name:'消费类型', dict_name:'用品',item_num:20000000.23};
	var s10={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:10,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:41,dict_type:'07',dict_type_name:'宠物类型', dict_name:'犬',item_num:300000};
	var s11={market_id:1,area_id:1,area_nm:null,province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:11,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:42,dict_type:'07',dict_type_name:'宠物类型', dict_name:'猫',item_num:400000};
	var s12={market_id:1,area_id:1,area_nm:"华北区",province_id:1,province_nm:"北京市",feature:"sfew  个委外各位",remark:"各位个人国务院突然",market_sale_id:12,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:43,dict_type:'07',dict_type_name:'宠物类型', dict_name:'其它',item_num:500};
	var s13={market_id:2,area_id:1,area_nm:"华北区",province_id:2,province_nm:"天津市",feature:"sfew  个文化土壤",remark:"国务院和认同",market_sale_id:13,year_month:"201610",
	        sign_satuts_id:11,sign_status_nm:"已签约",dict_id:22,dict_type:'04',dict_type_name:'医院规模', dict_name:'中',item_num:10};
	var s14={market_id:2,area_id:1,area_nm:"华北区",province_id:2,province_nm:"天津市",feature:"sfew  个文化土壤位",remark:"国务院和认同",market_sale_id:14,year_month:"201610",
	        sign_satuts_id:12,sign_status_nm:"未签约",dict_id:21,dict_type:'04',dict_type_name:'医院规模', dict_name:'大',item_num:30};
	var s15={market_id:2,area_id:1,area_nm:"华北区",province_id:2,province_nm:"天津市",feature:"sfew  个文化土壤",remark:"国务院和认同",market_sale_id:15,year_month:"201610",
	        sign_satuts_id:12,sign_status_nm:"未签约",dict_id:22,dict_type:'04',dict_type_name:'医院规模', dict_name:'中',item_num:300};
	var s16={market_id:2,area_id:1,area_nm:"华北区",province_id:2,province_nm:"天津市",feature:"sfew  个文化土壤",remark:"国务院和认同",market_sale_id:16,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:31,dict_type:'06',dict_type_name:'消费类型', dict_name:'活体',item_num:30000.00};
	var s17={market_id:2,area_id:1,area_nm:"华北区",province_id:2,province_nm:"天津市",feature:"sfew  个文化土壤",remark:"国务院和认同",market_sale_id:17,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:33,dict_type:'06',dict_type_name:'消费类型', dict_name:'用品',item_num:3000000.25};
	var s18={market_id:2,area_id:1,area_nm:"华北区",province_id:2,province_nm:"天津市",feature:"sfew  个文化土壤",remark:"国务院和认同",market_sale_id:18,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:41,dict_type:'07',dict_type_name:'宠物类型', dict_name:'犬',item_num:6000};
	var s19={market_id:2,area_id:1,area_nm:"华北区",province_id:2,province_nm:"天津市",feature:"sfew  个文化土壤",remark:"国务院和认同",market_sale_id:19,year_month:"201610",
	        sign_satuts_id:0,sign_status_nm:null,dict_id:42,dict_type:'07',dict_type_name:'宠物类型', dict_name:'猫',item_num:7000};
	market_sales.push(s1);
	market_sales.push(s2);
	market_sales.push(s3);
	market_sales.push(s4);
	market_sales.push(s5);
	market_sales.push(s6);
	market_sales.push(s7);
	market_sales.push(s8);
	market_sales.push(s9);
	market_sales.push(s10);
	market_sales.push(s11);
	market_sales.push(s12);
	market_sales.push(s13);
	market_sales.push(s14);
	market_sales.push(s15);
	market_sales.push(s16);
	market_sales.push(s17);
	market_sales.push(s18);
	market_sales.push(s19);
	
	var params = [{key:"area_id",arrName:"provinces", callback:function(ele, data){
		ele.area_id=data.area_id;
		ele.area_nm=data.area_nm;
		ele.year_month=data.year_month;
	}}, {key:"province_id",arrName:"dict_types",callback:function(ele, data){
		ele.market_id=data.market_id;
		ele.province_id=data.province_id;
		ele.province_nm=data.province_nm;
	}}, {key:"dict_type",arrName:"dicts",callback:function(ele, data){
		ele.dict_type=data.dict_type;
		ele.dict_type_name=data.dict_type_name;
	}}, {key:"dict_id",arrName:"signs",callback:function(ele, data){
		ele.dict_id=data.dict_id;
		ele.dict_name=data.dict_name;
	}}];
	
	var callback = function(ele, data){
		ele.market_sale_id=data.market_sale_id;
		ele.sign_status_id=data.sign_satuts_id;
		ele.sign_status_nm=data.sign_status_nm;
		ele.item_num=data.item_num;
	};
	
	var print = function(data){
		console.info(data);
		console.info(data.provinces);
		data.provinces.forEach(function(p){
			console.info(p.dict_types);
			p.dict_types.forEach(function(d){
				console.info(d.dicts);
				d.dicts.forEach(function(s){
					console.info(s);
				});
			});
		});
	}
	
	print(row2json.reform(market_sales, params, callback)[0]);
	console.info("------------------------------------------");
	print(row2json.reformMap(market_sales, params, callback)[1]);
	
	
}