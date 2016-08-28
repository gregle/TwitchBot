var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var Logger = require('../libs/logger.js');

var uri = require("../config.json").MongoDBURI;

mongoose.connect(uri);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  Logger.log('Mongoose default connection open to ' + uri);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  Logger.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  Logger.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    Logger.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

//load all files in models directory
fs.readdirSync('./models').forEach(function(filename) {
	if(~filename.indexOf('.js')) require(path.join(__dirname, '../', 'models', filename));
});