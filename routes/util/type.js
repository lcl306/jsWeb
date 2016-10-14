Type = function(){
	
	var toString = Object.prototype.toString;
	// isType是工厂函数，返回生成的函数
	var _isType = function(type){
		return function(obj){
			return toString.call(obj) === '[object '+type+']';
		};
	};
	
	/**
	 * type.isString(obj);
	 * */
	this.isString = _isType('String');
	
	/**
		 * type.isFunction(obj);
		 * */
	this.isFunction = _isType("Function");
	
	/**
		 * type.isArray(obj);
		 * */
	this.isArray = _isType("Array");
	
	/**
		 * type.isNumber(obj);
		 * */
	this.isNumber = function(obj){
		return obj==parseFloat(obj,10);
	};
}	

module.exports = new Type();
	