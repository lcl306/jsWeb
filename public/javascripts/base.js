var code = "UTF-8";

function postJson(url, data, callback, async){
	var asyn = typeof async == "undefined"?true:async;
	$.ajax( {   
     	type : "POST",   
     	contentType : "application/json; charset=" +code,
     	async : asyn,
     	url : url,   
     	data : $.toJSON(data),
     	dataType : "json",   
     	success : callback,
     	error   : function(xmlhttp, textStatus, errorThrown) {
     		//alert(textStatus);
     		var txt = xmlhttp.responseText;
     		if(txt!=null && txt.length<20){
     			window.location = xmlhttp.responseText;
     		}
        }
    });
}