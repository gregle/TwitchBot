var Audience = require('../libs/audience.js');
var Currency = require('../libs/currency.js');
var Twitch = require('../libs/twitch.js');
var Config = require("../config.json");

var Timers = function () {};

Timers.prototype.updateAudience = null;
Timers.prototype.updateCurrancy = null;
Timers.prototype.getStatus = null;
Timers.prototype.onlineStatus = null;

//Starts the various timers needed for the bot
Timers.prototype.startTimers = function(){
	//Run the status check one time at the start
	this.checkStatus();
	this.setAudienceTimer();

	//Check the streams current status default 5 min
	this.getStatus = setInterval(function() {
		this.checkStatus();
	}.bind(this), 1000 * 60 * Config.twitch.statusCheckRate );
};

//Check Stream online/offline
Timers.prototype.checkStatus = function(){
	Twitch.isStreamOnline(function(status){
		console.log("<--TWITCH BOT-->: Stream Status Check: " + status);
		if (this.onlineStatus !== status){
			this.onlineStatus = status;
			this.setCurrencyTimer();
		}
	}.bind(this));
};

//Sets and starts the timer that updates the audience information defaults 1 min intervals
Timers.prototype.setAudienceTimer = function(){
	this.updateAudience = setInterval(function() {
	    Audience.createUpdateMembers();
	}, 1000 * 60 * Config.audience.updateRate );
	console.log("<--TWITCH BOT-->: Started " + Config.audience.updateRate + " minute update Audience timer");
};

//Sets and starts the timer that increment the audience's currency total defaults 1 per 15min (online) 30 min (offline)
Timers.prototype.setCurrencyTimer = function(){
	var timer = 1000 * 60;
	if(this.onlineStatus){
		timer = timer * Config.currency.onlineRate;
	}
	else{
		timer = timer * Config.currency.offlineRate;
	}
	clearInterval(this.updateCurrancy);
	this.updateCurrancy = setInterval(function() {
	    Currency.modifyAllinChat(Config.currency.amountPerTick);
	}, timer);
	console.log("<--TWITCH BOT-->: Started " + timer/60/1000 + " minute update Currency timer");
};

module.exports = new Timers();