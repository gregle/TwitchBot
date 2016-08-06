var Audience = require('../libs/audience.js');

var Timers = function () {};

//check viewers every minute
var checkViewers;

Timers.prototype.streamOnline = function(){
	clearInterval(checkViewers);
	checkViewers = setInterval(function() {
	    Audience.createUpdateMembers();
	}, 1000 * 60);
	console.log("TWITCH BOT: Started 1 minute online timer");
};

Timers.prototype.streamOffline = function(){
	clearInterval(checkViewers);
	checkViewers = setInterval(function() {
	    Audience.createUpdateMembers();
	}, 1000 * 60 * 15);
	console.log("TWITCH BOT: Started 15 minute offline timer");
};

module.exports = new Timers();