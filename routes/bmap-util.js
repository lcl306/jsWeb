var Deferred = require("./component/util/deferred");
var exec = require("./component/util/exec");

/**
 * mapReduce(map, reduce[, options], callback)
 * Options
	out {Object}, sets the output target for the map reduce job. {inline:1} | {replace:’collectionName’} | {merge:’collectionName’} | {reduce:’collectionName’}
	query {Object}, query filter object.
	sort {Object}, sorts the input objects using this key. Useful for optimization, like sorting by the emit key for fewer reduces.
	limit {Number}, number of objects to return from collection.
	keeptemp {Boolean, default:false}, keep temporary data.
	finalize {Function | String}, finalize function.
	scope {Object}, can pass in variables that can be access from map/reduce/finalize.
	jsMode {Boolean, default:false}, it is possible to make the execution stay in JS. Provided in MongoDB > 2.0.X.
	verbose {Boolean, default:false}, provide statistics on job execution time.
	readPreference {String, only for inline results}, the preferred read preference, require(‘mongodb’).ReadPreference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
 * */
function mr(db){
	var collection = db.collection("shop_info");
	var map = function(){					
        emit("sum_mount",{mount:this.detail[0].mount.val,count:1});					
    };
    var reduce = function(key,values){
        var result = {mount:0,count:0};														
        values.forEach(function(m){														
	        result.mount += m.mount;														
	        result.count += m.count;														
	    });													
        return result;
    };
    collection.mapReduce(map, reduce, {out:{replace:"si_sumcount"},verbose:true},function(err,result,status){
    	if(err){
    		console.info(err);
    	}else{
    		console.info(status);
    		db.collection("si_sumcount").findOne(function(err, result){
    			if(!err){
    				console.info(result);
    			}
    		});
    	}
    });
}

/**
 * Options
	readPreference {String}, the preferred read preference, require(‘mongodb’).ReadPreference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
	group(keys, condition, initial, reduce, finalize, command[, options], callback)
 * Arguments:	
	keys (object) – an object, array or function expressing the keys to group by.
	condition (object) – an optional condition that must be true for a row to be considered.
	initial (object) – initial value of the aggregation counter object.
	reduce (function) – the reduce function aggregates (reduces) the objects iterated
	finalize (function) – an optional function to be run on each item in the result set just before the item is returned.
	command (boolean) – specify if you wish to run using the internal group command or using eval, default is true.
	[options] (object) – additional options during update.
	callback (function) – this will be called after executing this method. The first parameter will contain the Error object if an error occured, or null otherwise. While the second parameter will contain the results from the group method or null if an error occured.
 * */
 function grp(collection){
	collection.group([],{},{sum_mount:0},"function(doc, out){doc.detail.forEach(function(r){if(r.mount) out.sum_mount += r.mount.val;}); }", function(err,results){
		if(!err){
			console.info(results);
		}else{
			console.error(err);
		}
	});
 }
 /**
  * db.shop_info.group({
    "key":{"title.val":true},
    "initial":{shop_nm:"",mount:0},
    "reduce":function(doc, out){
        out.shop_nm = doc.title.val;
        doc.detail.forEach(function(d){
            if(d.mount) out.mount += d.mount.val;
        });
    }
});
  * */
/**
 * 声明一个查询
 * */
function showAll(db){
	var deferred = new Deferred();
	db.collection("shop_info").group([{"title.val":true}],{},{shop_nm:"",mount:0},
		"function(doc, out){ out.shop_nm = doc.title.val; doc.detail.forEach(function(d){ if(d.mount) out.mount += d.mount.val;});}",deferred.proxy());
	return deferred.promise;
}
 
 /**
  * aggregate(array[, options], callback)
  * Options
	readPreference {String}, the preferred read preference, require(‘mongodb’).ReadPreference ((ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
	cursor {Object}, return the query as cursor, on 2.6 > it returns as a real cursor on pre 2.6 it returns as an emulated cursor.
	cursor.batchSize {Number}, the batchSize for the cursor
	out {String}, the collection name to where to write the results from the aggregation (MongoDB 2.6 or higher). Warning any existing collection will be overwritten.
	explain {Boolean, default:false}, explain returns the aggregation execution plan (requires mongodb 2.6 >).
	allowDiskUse {Boolean, default:false}, allowDiskUse lets the server know if it can use disk to store temporary results for the aggregation (requires mongodb 2.6 >).
  * */
function aggr(collection){
	collection.aggregate([
	   {"$match":{"title.val":{$ne:"店100"}}},
	   {"$group":{_id:{shop_nm:"shop_nm"},count:{$sum:1}}}
	], function(err, result){
		if(!err){
			console.info(result);
		}else{
			console.error(err);
		}
	});
}

exports.mr = mr;
exports.grp = grp;
exports.aggr = aggr;
exports.showAll = showAll;

/**
 * update(selector, document[, options][, callback])
 * Options
	w, {Number/String, > -1 || ‘majority’ || tag name} the write concern for the operation where &lt; 1 is no acknowlegement of write and w >= 1, w = ‘majority’ or tag acknowledges the write
	wtimeout, {Number, 0} set the timeout for waiting for write concern to finish (combines with w option)
	fsync, (Boolean, default:false) write waits for fsync before returning, from MongoDB 2.6 on, fsync cannot be combined with journal
	j, (Boolean, default:false) write waits for journal sync before returning
	upsert {Boolean, default:false}, perform an upsert operation.
	multi {Boolean, default:false}, update all documents matching the selector.
	serializeFunctions {Boolean, default:false}, serialize functions on the document.
	checkKeys {Boolean, default:true}, allows for disabling of document key checking (WARNING OPENS YOU UP TO INJECTION ATTACKS)
	fullResult {Boolean, default:false}, returns the full result document (document returned will differ by server version)
 * */
	
 /**
  * save([doc][, options], [callback])
  * Options
	w, {Number/String, > -1 || ‘majority’ || tag name} the write concern for the operation where &lt; 1 is no acknowlegement of write and w >= 1, w = ‘majority’ or tag acknowledges the write
	wtimeout, {Number, 0} set the timeout for waiting for write concern to finish (combines with w option)
	fsync, (Boolean, default:false) write waits for fsync before returning, from MongoDB 2.6 on, fsync cannot be combined with journal
	j, (Boolean, default:false) write waits for journal sync before returning
  * */
