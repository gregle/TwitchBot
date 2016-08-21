var mongoose = require('mongoose');
var Twitch = require('../libs/twitch.js');
var config = require('../config.json');

var currencyStringHelper = {
	modify : function(target, amount){
		var output = Math.abs(amount) + " " + config.currency.name;
		if(amount >= 0){ output = output + " given to " + target + ".";}
		else { output = output + " taken from " + target + ".";}
		return output;
	},
	timeSpent : function(name, amount, timeWatched){
		var output = name + " has " + amount + " " + config.currency.name + " " + name + " and has spent ";
		var days =  Math.floor(timeWatched/24/60);
		if (days > 1 ){
			output = output + days + " Day";
			if (days>2) { output =  output + "s ";}
			else {output =  output + " ";}
		}
		var hours = Math.floor((timeWatched-(days * 24))/60);
		if (hours > 1 ){
			output = output + hours + " Hour";
			if (hours>2) { output =  output + "s ";}
			else {output =  output + " ";}
		}
		var minutes = (timeWatched - (days*24*60)) - (hours*60);
		if (minutes > 1 ){
			output = output + minutes + " Minute";
			if (minutes>2) { output =  output + "s ";}
			else {output =  output + " ";}
		}
		output = output + " here!";
		return output;
	}
};

var Currency = function () {};

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
			    		$currentDate: { lastSeen : true },
			    		$inc: { currency: amount }
					});
			}
		}
		if (bulk.length > 0) {
			bulk.execute(function(err,result) {
		       if(err){ console.log("<--!TWITCH BOT ERROR!-->: there was a problem with Audience updates: " + err); }
		       else { console.log("<--TWITCH BOT--> Audience table updated"); }
		    });
		}
	});
};

Currency.prototype.modifyCurrency = function(target, amount){
	if(target === "all"){
		this.modifyAllinChat(amount);
		var output = currencyStringHelper(target, amount);
		Twitch.client.action(config.user, output);
	}
	else{
		var members = mongoose.model('Member');
		members.findOneAndUpdate( 
			{name: target }, 
			{$inc: { currency: amount },
			 $currentDate: { lastSeen : true }},
			{upsert:true}, 
			function(err, doc){
			    if (err) {
			        console.error("there was a problem modifying currency Error JSON:", JSON.stringify(err, null, 2));
			        Twitch.client.action(config.user, "There was a problem, no " + config.currency.name + " given.");
			     } else {
					var output = currencyStringHelper.modify(target, amount);
					Twitch.client.action(config.user, output);
			     }
		});
	}
};

//str='this is a {0} response, {1}'' arg=['example', 'gregle' ]  
Currency.prototype.returnCurrencyCount = function(target, args){
	var members = mongoose.model('Member');
	members.findOne({'name': target}, function(err, doc){
		if (err) {
			console.error("there was a problem modifying currency Error JSON:", JSON.stringify(err, null, 2));
		} else {
			var output = currencyStringHelper.timeSpent(doc.name, doc.currency, doc.timeWatched);
			Twitch.client.action(config.user, output);
		}
	});
};

module.exports = new Currency();