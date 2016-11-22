var client = require("../routes/component/connect/memcacheConnect");

client.set('user_id', 1, 10000, function(err, result){
	if(err){
		console.error(err);
	}else{
		client.get('user_id', function(err, result2){
			if(err){
				console.error(err);
			}else
				console.info(result2);
		});
	}
	
});
