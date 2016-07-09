//load twitch messaging interface
var tmi=require('tmi.js');
var options = require("../config.json");

var Twitch = function () {};

Twitch.prototype.client = new tmi.client(options.twitch);
Twitch.prototype.client.connect();
Twitch.prototype.botUser = options.user;

module.exports = new Twitch();