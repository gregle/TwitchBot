var mongoose = require('mongoose');
var Twitch = require('../libs/twitch.js');
var Logger = require('../libs/logger.js');

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
		    			currency : 0,
		    			timeouts : 0
		    		 },
		    		$set: { moderator: ( attributeName === "moderators" ),
		    				lastSeen : new Date().toISOString() },
					$inc: { timeWatched: 1 }
				});
		}
	}
	if (bulk.length > 0) {
		bulk.execute(function(err,result) {
	       if(err){ Logger.error("There was a problem with Audience updates -- " + err); }
	       else { Logger.log("Audience table updated"); }
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
	  if (err) {Logger.error("Could not retrieve firstSeen record -- " + err);}
	  if(member) { Twitch.sendChatMsg(member.name + ' was first seen on ' + member.firstSeen.toDateString()); }
	});
};

//Show the five users with the most timeouts
Audience.prototype.getTopTrolls = function(){
	var Member = mongoose.model('Member');

	//Find the top users and report it to the chat
	Member.find().sort({timeouts: -1}).limit(5).exec( function (err, member) {
	  if (err) {Logger.error("Could not retrieve topTrolls -- " + err);}
	  if(member) { 
	  	var res = 'The top trolls are: ';
	  	for(var i = 0; i < member.length; i++){
	  		res = res + (i + 1) + ": " + member[i].name + ' (' + member[i].timeouts + ' timeouts) ';
	  	}
	  	//future work, once there's a rate limiter display the messages one at a time
	  	Twitch.sendChatMsg(res);
	  }
	});
};

Audience.prototype.incrementTrollCount = function(target){
	var Member = mongoose.model('Member');

	//Find the targeted user and announce when they were first seen
	Member.findOneAndUpdate( { name: target }, {$inc: { timeouts: 1 }}, function(err, doc){
    if (err) {
        Logger.error("Failed to increase " + target + "'s timeouts. Error JSON:", JSON.stringify(err, null, 2));
     } else {
        Logger.log(target + "'s timeouts has been increased to "  + doc.timeouts + 1);
     }
  });
};

module.exports = new Audience();