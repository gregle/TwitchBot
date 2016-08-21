//load twitch messaging interface
var tmi=require('tmi.js');
var options = require("../config.json");

var Twitch = function () {};

Twitch.prototype.client = new tmi.client(options.twitch);
Twitch.prototype.client.connect();
Twitch.prototype.clientID = options.clientID;
Twitch.prototype.channel = options.twitch.channels[0].substring(1);

//query Twitch to determine if the stream is online defaults every 5 minutes
Twitch.prototype.isStreamOnline = function(callback){
	this.client.api({
		url: "https://api.twitch.tv/kraken/streams/" + this.channel,
		method: "GET"
	}, function(err, res, body) {
		if (err){
			console.log("<--!TWITCH BOT ERROR!-->: Could not retrieve audience list from Twitch");
		}
		else{
	    	var response = JSON.parse(body);
			if (response.stream === null) { 
		        //The stream is offline push false into the callback
				callback(false);
		    } else {
		        //The stream is online, push true into the callback
		    	callback(true);
		    }
		}
	});
};

//Gets a current list of the members in the Twitch Chat room
Twitch.prototype.getChatterList = function(callback, cbOptions) {
	this.client.api({
		url: "http://tmi.twitch.tv/group/user/" + this.channel + "/chatters",
		method: "GET"
	}, function(err, res, body) {
		if (err){
			console.log("<--!TWITCH BOT ERROR!-->: Could not retrieve audience list");
		}
		else{
			//Turn it into a JSON and shove it into the callback
			var chatters = JSON.parse(body).chatters;
			callback(chatters);
		}
	});
};

//Sends a message to twitch chat. Future work is to group messages and send them all at once in order to not send too many messages too quickly
Twitch.prototype.sendChatMsg = function(msg){
	this.client.action(this.channel, msg);
};

module.exports = new Twitch();