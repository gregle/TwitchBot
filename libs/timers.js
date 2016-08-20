var Audience = require('../libs/audience.js');
var Currency = require('../libs/currency.js');
var Twitch = require('../libs/twitch.js');
var Config = require("../config.json");

var Timers = function () {};

//check viewers every minute
Timers.prototype.updateAudience = null;
Timers.prototype.updateCurrancy = null;
Timers.prototype.getStatus = null;
Timers.prototype.onlineStatus = null;

Timers.prototype.startTimers = function(){
	this.checkStatus();
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
	var timer = 1000 * 60;
	if(this.onlineStatus){
		timer = timer * Config.audience.onlineRate;
	}
	else{
		timer = timer * Config.audience.offlineRate;
	}
	clearInterval(this.updateAudience);
	updateAudience = setInterval(function() {
	    Audience.createUpdateMembers();
	}, timer);
	console.log("<--TWITCH BOT-->: Started " + timer/60/1000 + " minute updateAudience timer");
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
	updateCurrancy = setInterval(function() {
	    Currency.modifyCurrency("all", 1);
	}, timer);
	console.log("<--TWITCH BOT-->: Started " + timer/60/1000 + " minute updateCurrency timer");
};

module.exports = new Timers();