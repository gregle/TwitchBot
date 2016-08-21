var mongoose = require('mongoose');
var Twitch = require('../libs/twitch.js');
var config = require('../config.json');

//Helper object holding the complex string generators
var currencyStringHelper = {
	//Generates the string associated with currency modification (add rem)
	modify : function(target, amount){
		var output = Math.abs(amount) + " " + config.currency.name;
		if(amount >= 0){ output = output + " given to " + target + ".";}
		else { output = output + " taken from " + target + ".";}
		return output;
	},
	//Generates the string associated with a users total viewing time
	timeSpent : function(name, amount, timeWatched){
		var output = name + " has " + amount + " " + config.currency.name + " and has spent ";
		var days =  Math.floor(timeWatched/24/60);
		if (days >= 1 ){
			output = output + days + " Day";
			if (days>2) { output =  output + "s ";}
			else {output =  output + " ";}
		}
		var hours = Math.floor((timeWatched-(days *24*60))/60);
		if (hours >= 1 ){
			output = output + hours + " Hour";
			if (hours>2) { output =  output + "s ";}
			else {output =  output + " ";}
		}
		var minutes = (timeWatched - (days*24*60)) - (hours*60);
		if (minutes >= 1 ){
			output = output + minutes + " Minute";
			if (minutes>2) { output =  output + "s ";}
			else {output =  output + " ";}
		}
		output = output + " here!";
		return output;
	}
};

var Currency = function () {};

//Do a bulk operation to give currency to everyone in the channel 
Currency.prototype.modifyAllinChat = function(amount){
	Twitch.getChatterList(function(chatters){
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
		    			moderator: false,
		    			timeWatched: 0
    		 		},
		    		$set: { lastSeen : new Date().toISOString() },
					$inc: { currency: amount }
				});
			}
		}
		if (bulk.length > 0) {
			//Make a system log but don't announce it to chat
			bulk.execute(function(err,result) {
		       if(err){ console.log("<--!TWITCH BOT ERROR!-->: there was a problem with Audience updates: " + err); }
		       else { console.log("<--TWITCH BOT--> Audience table updated"); }
		    });
		}
	});
};

//Add or remove currency from chat
Currency.prototype.modifyCurrency = function(target, amount){
	//Check to see if we're targeting the entire chat or just an individual
	if(target === "all"){
		this.modifyAllinChat(amount);
		var output = currencyStringHelper.modify(target, amount);
		Twitch.sendChatMsg(output);
	}
	else{
		var members = mongoose.model('Member');
		members.findOneAndUpdate( 
			{name: target }, 
			{$setOnInsert: { 
    			firstSeen : new Date().toISOString(),
    			moderator: false,
    			timeWatched: 0
	 		},
			$inc: { currency: amount },
			$set: { lastSeen : new Date().toISOString()}},
			{upsert:true}, 
			function(err, doc){
			    if (err) {
			        console.error("there was a problem modifying currency Error JSON:", JSON.stringify(err, null, 2));
			        Twitch.sendChatMsg("There was a problem, no " + config.currency.name + " given.");
			     } else {
					var output = currencyStringHelper.modify(target, amount);
					Twitch.sendChatMsg(output);
			     }
		});
	}
};

//Return and output a user's current currency count 
Currency.prototype.returnCurrencyCount = function(target, args){
	var members = mongoose.model('Member');
	members.findOne({'name': target}, function(err, doc){
		if (err) {
			console.error("there was a problem getting currency Error JSON:", JSON.stringify(err, null, 2));
			Twitch.sendChatMsg(doc.name + ", there was a problem getting currency" );
		} else {
			var output = currencyStringHelper.timeSpent(doc.name, doc.currency, doc.timeWatched);
			Twitch.sendChatMsg(output);
		}
	});
};

module.exports = new Currency();