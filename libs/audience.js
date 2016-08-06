var mongoose = require('mongoose');
var Twitch = require('../libs/twitch.js');

var Audience = function () {};

var updateViewersDB = function(chatters){
	var collection = mongoose.model('Viewer').collection;

	var bulk = collection.initializeUnorderedBulkOp();
	//Create and update all the viewers
	for(var attributeName in chatters){
		for (var i = 0; i < chatters[attributeName].length; i++) {	
		    bulk.find({"name": chatters[attributeName][i] })
		    	.upsert()
		    	.update({
		    		'$set':{
			    		'lastSeen': new Date().toISOString()
						.replace(/T/, ' ')
						.replace(/\..+/, ''),
						'moderator': ( attributeName === "moderators" )},
					"$inc": {
						"timeWatched": 1 }});
		}
	}
	if (bulk.length > 0) {
		bulk.execute(function(err,result) {
	       if(err){ console.log("ERROR: there was a problem with viewer updates: " + err); }
	       else { console.log("TWITCH BOT: viewer table updated"); }
	    });
	}
};

Audience.prototype.createUpdateMembers = function(){
	Twitch.getChatterList(updateViewersDB);
};

module.exports = new Audience();