var mongoose = require('mongoose');
var Twitch = require('../libs/twitch.js');

var Audience = function () {};

var updateAudiencesDB = function(chatters){
	var members = mongoose.model('Member').collection;

	var bulk = members.initializeUnorderedBulkOp();
	//Create and update all the Audiences
	for(var attributeName in chatters){
		for (var i = 0; i < chatters[attributeName].length; i++) {	
		    bulk.find({ name: chatters[attributeName][i] })
				.upsert()
		    	.update({
		    		$currentDate: { lastSeen : true },
		    		$set: { moderator: ( attributeName === "moderators" )},
					$inc: { timeWatched: 1 }
				});
		}
	}
	if (bulk.length > 0) {
		bulk.execute(function(err,result) {
	       if(err){ console.log("<--!TWITCH BOT ERROR!-->: there was a problem with Audience updates: " + err); }
	       else { console.log("<--TWITCH BOT--> Audience table updated"); }
	    });
	}
};

Audience.prototype.createUpdateMembers = function(){
	Twitch.getChatterList(updateAudiencesDB);
};

module.exports = new Audience();