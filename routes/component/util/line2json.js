/**
 var rtns = reform(labs, [{key:'lab_id',arrName:"dict_types",callback:function(element, data){
		element.lab_id=data.lab_id;
		element.lab_nm=data.lab_nm;
		element.lab_spec=data.lab_spec;
		element.lng=data.lng;
		element.lat=data.lat;
	}}, {key:'dict_type',arrName:"dicts",callback:function(element,data){
		element.dict_type=data.dict_type;
	}}], function(element, data){
		element.dict_id=data.dict_id;
		element.dict_name=data.dict_name;
	});
 * */
function reform(datas, params, callback){
	var results = [];
	var keys = [];
	var parent = results;
	datas.forEach(function(data){		
		for(var i=0; i<params.length; i++){
			var arr = i===0?results:parent[params[i-1].arrName];
			if(data[params[i].key]!==keys[i]){
				var ele ={};
				params[i].callback(ele, data);
				ele[params[i].arrName]=[];
				arr.push(ele);
			}
			parent = arr[arr.length-1];
			keys[i]=data[params[i].key];
		}
		var t = {};
		callback(t,data);
		parent[params[params.length-1].arrName].push(t);
		parent=results;
	});
	return results;
}

exports.reform=reform;