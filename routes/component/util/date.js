function format(date, formatStr){   
	var str = formatStr;  
	str=str.replace(/yyyy|YYYY/,date.getFullYear());   
	str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));   
	
	var month = date.getMonth()+1;
	str=str.replace(/MM/,month>9?month.toString():'0' + month);   
	str=str.replace(/M/g,month); 

	str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());   
	str=str.replace(/d|D/g,date.getDate());   

	str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());   
	str=str.replace(/h|H/g,date.getHours());   
	str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());   
	str=str.replace(/m/g,date.getMinutes());   

	str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());   
	str=str.replace(/s|S/g,date.getSeconds());   

	return str;   
};

function add(date, part, value) {
	if(typeof date =="string") date = new Date(date);
    value *= 1;  
    if (isNaN(value)) {  
        value = 0;  
    }  
    switch (part) {  
        case "y":  
            date.setFullYear(date.getFullYear() + value);  
            break;  
        case "m":  
            date.setMonth(date.getMonth() + value);  
            break;  
        case "d":  
            date.setDate(date.getDate() + value);  
            break;  
        case "h":  
            date.setHours(date.getHours() + value);  
            break;  
        case "n":  
            date.setMinutes(date.getMinutes() + value);  
            break;  
        case "s":  
            date.setSeconds(date.getSeconds() + value);  
            break;  
        default:  
   
    }
    return date;
} 

exports.format=format;
exports.add=add;
