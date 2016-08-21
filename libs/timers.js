var Audience = require('../libs/audience.js');
var Currency = require('../libs/currency.js');
var Twitch = require('../libs/twitch.js');
var Config = require("../config.json");

var Timers = function () {};

Timers.prototype.updateAudience = null;
Timers.prototype.updateCurrancy = null;
Timers.prototype.getStatus = null;
Timers.prototype.onlineStatus = null;

Timers.prototype.startTimers = function(){
	//Check the stream status on bot start
	this.checkStatus();

	//Start the timer that runs checkStatus which is what is used to determine the 
	//	the rates of the other timers.
	this.getStatus = setInterval(function() {
		this.checkStatus();
	}, 1000 * 60 * Config.twitch.statusCheckRate );
};

Timers.prototype.checkStatus = function(){
	Twitch.isStreamOnline(function(status){
		if (this.onlineStatus !== status){
			this.onlineStatus = status;
			this.setAudienceTimer();
			this.setCurrencyTimer();
		}
	}.bind(this));
};

Timers.prototype.setAudienceTimer = function(){
	this.updateAudience = setInterval(function() {
	    Audience.createUpdateMembers();
	}, 1000 * 60 * Config.audience.updateRate );
	console.log("<--TWITCH BOT-->: Started " + Config.audience.updateRate + " minute updateAudience timer");
};

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
	console.log("<--TWITCH BOT-->: Started " + timer/60/1000 + " minute updateCurrency timer");
};

module.exports = new Timers();