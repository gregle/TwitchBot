var mongojs = require("mongojs");
var uri = require("../config.json").MongoDBURL;
var db = mongojs(uri);

// Database constructor
function Database () {}

// Initialize a new instance of our database
Database.prototype.init = function(tables){
    db = mongojs(uri);
    db.getCollectionNames(function(err, result){
    	for (var i = 0; i < tables.length; i++){
			console.log('\r\nChecking for ' + tables[i] + ' table');
			if(result.indexOf(tables[i]) >= 0)
			{
				console.log(tables[i] + ' exists');
			}
			else{
				console.log(tables[i] + ' table missing; creating ' + tables[i] + ' table');
				db.createCollection(tables[i],{});
			}
		}
    });
};

Database.prototype.insertUpdateItem = function(collectionName, key, update, callback){
	callback = callback || null;
	var collection = db.collection(collectionName);
	if(collection){
	    collection.update(key, {$set : update}, { upsert: true }, function(err, result) {
	       if (err) {
	           console.error("insertItem failed:in collection", collectionName + " Entry: " + JSON.stringify(key, null, 2) , ". Error JSON:", JSON.stringify(err, null, 2));
	       		// TODO SEND NOTICE TO OUTPUT MODULE
	       } else {
	           console.log("insertItem succeeded in collection", collectionName + " Entry: " + JSON.stringify(key, null, 2));
	           if (callback){callback();}
	       }
	    });
	}
	else{ console.log('Could not find collection ' + collectionName + ' on insert'); }
};

Database.prototype.getItem = function(collectionName, keys, callback){
	db.collection(collectionName).find(keys, callback);
};

module.exports = Database;