//load twitch messaging interface
var mongoose = require('mongoose');

// Load Modules and Configuration
var options = require('./config.json');
var db = require('./libs/database.js');
var Twitch = require('./libs/twitch.js');
var Commands = require('./libs/commands.js');
var Audience = require('./libs/audience.js');
var Currency = require('./libs/currency.js');
var Timers = require('./libs/timers.js');

var botUser = options.user;

var isUserMod = function(channel, user){
	return (user["user-type"] === "mod" || user.username === channel.replace("#", ""));
};

Twitch.client.on("connected", function(address, port)	{
	Twitch.client.action(botUser, "Hello world.");
	Timers.startTimers();
});

//This is runs with every line of chat
Twitch.client.on('chat', function(channel, user, message, self){
	//if the first character of the message is an exclamation mark it's probably a command
	if(message.indexOf('!') === 0){
		//split the message the first value will be the command, subsequent values will be the arguments
		var msgArr = message.toLowerCase().split(" ");
		if(msgArr[0] === "!command"){
			// Username is a mod or username is the broadcaster..
			if (isUserMod(channel, user)){
				if (msgArr[1] && msgArr[1] === 'add'){
					Commands.createCmd( msgArr[2], message.substring( message.indexOf ( msgArr[2] + ' ' ) + msgArr[2].length ).trim());
				}
				if (msgArr[1] && msgArr[1] === 'remove'){
					Commands.removeCmd( msgArr[2] );
				}
			}
			else{
				Twitch.client.action(user['display-name'] + ", only mods can use that command");
			}
		}
		else if(msgArr[0] === "!bot"){
			Twitch.client.action(botUser, " My purpose is unknown.");
		}
		else if(msgArr[0] === "!" + options.currency.name){
			if(isUserMod(channel, user) && msgArr[1]){ 
				if(msgArr[1] === "add" || msgArr[1] === "rem"){
					var modifier = 1;
					if ( msgArr[1] === "rem" ) {modifier = -1;}
					else {Currency.modifyCurrency(msgArr[2], (parseInt(msgArr[3]) * modifier));}
				}
				else{
					Currency.returnCurrencyCount(msgArr[1].toLowerCase());
				}
			}
			else{
				Currency.returnCurrencyCount(user['display-name'].toLowerCase());
			}
		}
		else{
			mongoose.model('Command').find({"keyword": msgArr[0]}, function(err, data) {
			    if (err) { Twitch.client.action(botUser, 'There was a problem'); console.log(err);}
			    else {
			        if(data.length > 0) { 
			        	var output = Commands.processString(data[0].output, msgArr.slice(1));
			        	Twitch.client.action(botUser, output);
			        }
			    }
			});
		}
	}
});