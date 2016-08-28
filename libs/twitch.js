//load twitch messaging interface
var tmi=require('tmi.js');
var options = require("../config.json");

var Twitch = function () {};

Twitch.prototype.client = new tmi.client(options.twitch);
Twitch.prototype.client.connect();
Twitch.prototype.clientID = options.clientID;
Twitch.prototype.channel = options.twitch.channels[0].substring(1);

var calcDateDiffString = function(duration){
	var seconds = parseInt((duration/1000)%60),
		minutes = parseInt((duration/(1000*60))%60),
		hours = parseInt((duration/(1000*60*60))%24),
		days = parseInt((duration/(1000*60*60*24))%1);
	var output = "";
	if (days >= 1 ){
		output = output + days + " Day";
		if (days>=2) { output =  output + "s ";}
		else {output =  output + " ";}
	}
	if (hours >= 1 ){
		output = output + hours + " Hour";
		if (hours>=2) { output =  output + "s ";}
		else {output =  output + " ";}
	}
	if (minutes >= 1 ){
		output = output + minutes + " Minute";
		if (minutes>=2) { output =  output + "s ";}
		else {output =  output + " ";}
	}
	if (seconds >= 1 ){
		output = output + seconds + " Second";
		if (seconds>=2) { output =  output + "s ";}
		else {output =  output + " ";}
	}
    return output;
};

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
			if (body.stream === null) { 
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
Twitch.prototype.getChatterList = function(callback) {
	this.client.api({
		url: "http://tmi.twitch.tv/group/user/" + this.channel + "/chatters",
		method: "GET"
	}, function(err, res, body) {
		if (err){
			console.log("<--!TWITCH BOT ERROR!-->: Could not retrieve audience list");
		}
		else{
			//Shove it into the callback
			callback(body.chatters);
		}
	});
};

//Queries for a stream's uptime and sends a string into a callback function
Twitch.prototype.getStreamUptime = function(callback) {
	this.client.api({
		url: "https://api.twitch.tv/kraken/streams/" + this.channel,
		method: "GET"
	}, function(err, res, body) {
		if (err){
			console.log("<--!TWITCH BOT ERROR!-->: Could not retrieve audience list from Twitch");
		}
		else{
			if (body.stream === null) { 
		        //The stream is offline push false into the callback
				callback('The stream is offline');
		    } else {
		        //The stream is online, push true into the callback
		        var timeDiff = Date.now() - new Date(body.stream.created_at);
		    	callback(body.stream.channel.name + ' has been live for ' + calcDateDiffString(timeDiff));
		    }
		}
	});
};

//Sends a message to twitch chat. Future work is to group messages and send them all at once in order to not send too many messages too quickly
Twitch.prototype.sendChatMsg = function(msg){
	this.client.action(this.channel, msg);
};

//Sends a message to twitch chat. Future work is to group messages and send them all at once in order to not send too many messages too quickly
Twitch.prototype.sendWhisperMsg = function(target, msg){
	this.client.whisper(target, msg);
};

module.exports = new Twitch();