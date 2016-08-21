var mongoose = require('mongoose');
var Twitch = require('../libs/twitch.js');

var Audience = function () {};

//Use the list of chatters to do a bulk DB update
var updateAudiencesDB = function(chatters){
	var members = mongoose.model('Member').collection;

	var bulk = members.initializeUnorderedBulkOp();
	//Create and update all the Audiences
	for(var attributeName in chatters){
		for (var i = 0; i < chatters[attributeName].length; i++) {	
		    bulk.find({ name: chatters[attributeName][i] })
				.upsert()
		    	.update({
		    		$setOnInsert: { 
		    			firstSeen : new Date().toISOString(),
		    			currency : 0
		    		 },
		    		$set: { moderator: ( attributeName === "moderators" ),
		    				lastSeen : new Date().toISOString() },
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

//Get everyone that's in the twitch chat and update their DB entries
Audience.prototype.createUpdateMembers = function(){
	Twitch.getChatterList(updateAudiencesDB);
};

//Show when an audience member was First Seen in chat
Audience.prototype.getFirstSeen = function(target){
	var Member = mongoose.model('Member');

	//Find the targeted user and announce when they were first seen
	Member.findOne({ name: target }, 'name firstSeen', function (err, member) {
	  if (err) return handleError(err);
	  if(member) { Twitch.sendChatMsg(member.name + ' was first seen on ' + member.firstSeen); }
	});
};

module.exports = new Audience();