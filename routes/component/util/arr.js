/**
 * 数组去重
 * */
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

function indexOf(arr, val) {
	for (var i = 0; i < arr.length; i++) {
    	if (arr[i] == val) return i;
    }
    return -1;
};

function remove(arr, val) {
	var index = arr.indexOf(val);
	if (index > -1) {
		arr.splice(index, 1);
	}
};

exports.unique=unique;
exports.indexOf=indexOf;
exports.remove=remove;