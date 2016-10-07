var util = require("util");

JsonParseBase = function(){
	this.isArray = function(obj){
		return Object.prototype.toString.call(obj) === '[object Array]';   
	};
	
	this.isInt = function(obj){
		return obj==parseFloat(obj,10);
	};
	
	this.parseProp = function(prop){
		var pinfo = prop.split("[");
		for(var i=0;i<pinfo.length;i++){
			pinfo[i]=pinfo[i].match(/.*[^\]]/g); // /g返回匹配string，不加/g返回匹配对象（匹配string、index：匹配string位置）
		}
		return pinfo;
	};
	
	/**
		如果root下直接是数据，使用setLeaf
	*/
	this.setLeaf = function(twig, leaf, leafVal){
		twig[leaf] = leafVal;
	};
	
	/**
		如果root下有多层对象，使用setTwig
		返回放入的twig
	*/
	this.setTwig = function(branch, twig){
		if(!branch[twig]) branch[twig] = {};
		return branch[twig];
	};
	
	this.setTwigLeaf = function(branch, twig, leaf, leafVal){
		this.setLeaf(this.setTwig(branch, twig), leaf, leafVal);
	};
	
	/**
		放入twig的数组，返回数组的当前元素（即为当前twig）
		@twigsName 即为twig的数组名
	*/
	this.setTwigs = function(branch, twigsName, idx, preIdx){
		if(!branch[twigsName]) branch[twigsName] = [];
		var idx = typeof idx=="object"?idx.toString():idx;  //idx是object对象，应该变为string对象才能和preIdx比较
		var preIdx = typeof preIdx=="object"?preIdx.toString():preIdx; //同上
		if(idx!=preIdx) {  //string和int可以用==比较，object不能用==比较
			branch[twigsName].push({});
		}
		return branch[twigsName][idx];
	};
};

JsonParse = function(){
	JsonParseBase.call(this); //将JsonParseBase的所有上下文copy给JsonParse，以继承JsonParseBase中的非prototype的属性和方法
};

/**
 * 继承JsonBase
 * */
util.inherits(JsonParse, JsonParseBase);

var jsonParse = new JsonParse();

//express中，默认module.exports={}, exports=module.exports
//如果需要导出类，使用module.exports=JsonParse
//如果需要导出对象，使用moudle.exports=jsonParse
//如果需要导出方法，使用exports.setLeaf=jsonParse.setLeaf
exports = module.exports = jsonParse;
