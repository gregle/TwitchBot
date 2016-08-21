//load twitch messaging interface
var tmi=require('tmi.js');
var options = require("../config.json");

var Twitch = function () {};

Twitch.prototype.client = new tmi.client(options.twitch);
Twitch.prototype.client.connect();
Twitch.prototype.botUser = options.user;
Twitch.prototype.clientID = options.clientID;
Twitch.prototype.channel = options.twitch.channels[0].substring(1);

Twitch.prototype.isStreamOnline = function(callback){
	this.client.api({
		url: "https://api.twitch.tv/kraken/streams/" + this.channel,
		method: "GET"
	}, function(err, res, body) {
		if (err){
			console.log("<--!TWITCH BOT ERROR!-->: Could not retrieve audience list");
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

Twitch.prototype.getChatterList = function(callback, cbOptions) {
	this.client.api({
		url: "http://tmi.twitch.tv/group/user/" + this.channel + "/chatters",
		method: "GET"
	}, function(err, res, body) {
		if (err){
			console.log("<--!TWITCH BOT ERROR!-->: Could not retrieve audience list");
		}
		else{
			var chatters = JSON.parse(body).chatters;
			callback(chatters);
		}
	});
};

module.exports = new Twitch();