var archive = require("../routes/component/util/archive");

function testZip(){
	archive.zip("D:/360安全浏览器下载/dbmsm14.zip", "D:/360安全浏览器下载", "dbmsm14.sql");
}

testZip();
