var type = require("./type");
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
	return reforms([], datas, params, callback);
}

function reformMap(datas, params, callback){
	return reforms({}, datas, params, callback);
}

function reforms(results, datas, params, callback){
	//var results = [];
	var keys = [];
	var parent = results;
	var preParents = [];
	datas.forEach(function(data){		
		for(var i=0; i<params.length; i++){
			var arr = i===0?results:parent[params[i-1].arrName];
			var preParent = i===0?results:preParents[i-1];
			if(parent!==preParent || data[params[i].key]!==keys[i]){
				var ele ={};
				params[i].callback(ele, data);
				ele[params[i].arrName]=[];
				//arr.push(ele);
				push(arr, ele, params);
			}
			if(i>0 && parent!==preParent){
				preParents[i-1] = parent;
			}
			//parent = arr[arr.length-1];
			parent = getParent(arr, data, params);
			keys[i]=data[params[i].key];
		}
		var t = {};
		callback(t,data);
		parent[params[params.length-1].arrName].push(t);
		parent=results;
	});
	return results;
}

function push(arr, ele, params){
	if(type.isArray(arr)){
		arr.push(ele);
	}else{
		arr[ele[params[0].key]] = ele;
	}
}

function getParent(arr, data, params){
	if(type.isArray(arr)){
		return arr[arr.length-1];
	}else{
		return arr[data[params[0].key]];
	}
}

exports.reform=reform;
exports.reformMap = reformMap;