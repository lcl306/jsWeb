Message = function(){
	this.noChar = "包含禁止文字：%。";
	this.noFigure = "超过%位。";
	this.noEmpty = "不能为空。";
	this.noNum = "不是数值。";
	this.noDay = "不是有效日期。";
	this.noIntFigure = "整数位数超过%位。";
	this.noDotFigure = "小数位数超过%位。";
}

var message = new Message();

module.exports = message;