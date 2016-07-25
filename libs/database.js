var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

var uri = require("../config.json").MongoDBURL;
mongoose.connect(uri, function(err) {
    if (err) console.log('There was a problem connecting to the database. Functionality will be limited until the bot is restarted');
});

// Database constructor
function Database () {}

//load all files in models directory
fs.readdirSync('./models').forEach(function(filename) {
	if(~filename.indexOf('.js')) require(path.join(__dirname, '../', 'models', filename));
});

Database.prototype.insertUpdateItem = function(schemaName, key, update, callback){
	callback = callback || null;
	var collection = mongoose.model(schemaName);
    collection.update(key, {$set : update}, { upsert: true }, function(err, result) {
       if (err) {
           console.error("insertItem failed:in collection", schemaName + " Entry: " + JSON.stringify(key, null, 2) , ". Error JSON:", JSON.stringify(err, null, 2));
       		// TODO SEND NOTICE TO OUTPUT MODULE
       } else {
           console.log("insertItem succeeded in collection", schemaName + " Entry: " + JSON.stringify(key, null, 2));
           if (callback){callback();}
       }
    });
};

Database.prototype.getItem = function(schemaName, keys, callback){
	mongoose.model(schemaName).find(keys, callback);
};

Database.prototype.removeItem = function(schemaName, keys, callback){
	callback = callback || null;
	mongoose.model(schemaName).find(keys).remove(callback);
};

module.exports = new Database();