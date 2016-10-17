var events = require("events");
var util = require("util");

Promise = function(){
	events.EventEmitter.call(this);
	
	//放在Promise内才是public，放在Promise是private
	Promise.prototype.then = function(successHandler, errorHandler, processHandler){
		if(typeof successHandler === "function"){
			this.once("success", successHandler);   //只能回调一次
		}
		if(typeof errorHandler === "function"){
			this.once("error", errorHandler);		//只能回调一次
		}
		if(typeof processHandler === "function"){
			this.on("process", processHandler);   //这里是on
		}
		return this; //可以链式调用
	};
};

util.inherits(Promise, events.EventEmitter);


/**
 * 和promise联合使用
 * 状态：success、error、process
 * process----->success，不可逆、不能更改
 * process----->error，不可逆、不能更改
 * success和error不能转化
 * */
Deferred = function(){    //维护回调和状态
	this.promise = new Promise();
	this.status = "";
	
	Deferred.prototype.proxy = function(){
		var self = this;
		return function(err, value){
			if(err){
				self.error(err);
			}else{
				self.success(value);
			}
		};
	};
	
	/**
	 * 多个事件，统一回调
	 * */
	Deferred.prototype.all = function(promises){
		var that = this;
		var results = [];
		var count = promises.length;
		promises.forEach(function(promise, i){
			promise.then(function(value){
				results.push(value);
				count--;
				if(count==0){
					that.success(results);
				}
			}, function(err){
				that.error(err);
			});
		});
		return this.promise;
	};
};

Deferred.prototype.success = function(obj){
	this.status = "success";
	this.promise.emit("success", obj);
};

Deferred.prototype.error = function(err){
	this.status = "error";
	this.promise.emit("error", err);
};

Deferred.prototype.process = function(data){
	this.status = "process";
	this.promise.emit("process", data);
};


module.exports = Deferred;