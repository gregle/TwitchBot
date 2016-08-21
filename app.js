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

//Check to see if a user is a mod or the channel's owner
var isUserMod = function(channel, user){
	return (user["user-type"] === "mod" || user.username === channel.replace("#", ""));
};

//Once the client connects announce it's presence and start the timers
Twitch.client.on("connected", function(address, port)	{
	Twitch.sendChatMsg("Hello world.");
	Timers.startTimers();
});

//With every line of chat
Twitch.client.on('chat', function(channel, user, message, self){
	//Don't listen to my own messages
	if (self) return;
	//If the first character of the message is an exclamation mark it's probably a command
	if(message.indexOf('!') === 0){
		//Split the message, the first value will be the command, subsequent values will be the arguments
		var msgArr = message.toLowerCase().split(" ");
		//Triggers all things related to !command
		if(msgArr[0] === "!command"){
			// Username is a mod or username is the broadcaster..
			if (isUserMod(channel, user)){
				//check to see if there's additional arguments
				if (msgArr[2]){
					if (msgArr[1] && msgArr[1] === 'add'){
						var msg = "";
						if (msgArr[3]){ msg = message.substring( message.indexOf ( msgArr[2] + ' ' ) + msgArr[2].length ).trim(); }
						else {msg = "";}
						console.log("msg: " + msg);
						Commands.createCmd( msgArr[2], msg );
					}
					if (msgArr[1] && msgArr[1] === 'rem'){
						Commands.removeCmd( msgArr[2] );
					}
				}
			}
			else{
				Twitch.sendChatMsg(user['display-name'] + ", only mods can use that command");
			}
		}
		else if(msgArr[0] === "!firstseen"){
			Audience.getFirstSeen(user.username);
		}
		//Self identifying command
		else if(msgArr[0] === "!parrot"){
			var output = message.substr(message.indexOf(" ") + 1);
			Twitch.sendChatMsg(output);
		}
		//Self identifying command
		else if(msgArr[0] === "!bot"){
			Twitch.sendChatMsg("My purpose is unknown.");
		}
		//Currency commands
		else if(msgArr[0] === "!" + options.currency.name){
			if(isUserMod(channel, user) && msgArr[1]){ 
				//Add or remove works off of the same function so we just need to either modify it to be positive or negative
				if(msgArr[1] === "add" || msgArr[1] === "rem"){
					var modifier = 1;
					if ( msgArr[1] === "rem" ) {modifier = -1;}
					Currency.modifyCurrency(msgArr[2], (parseInt(msgArr[3]) * modifier));
				}
				else{
					Currency.returnCurrencyCount(msgArr[1].toLowerCase());
				}
			}
			else{
				Currency.returnCurrencyCount(user['display-name'].toLowerCase());
			}
		}
		//Anything else must be an attempt to find a command in the command collection
		else{
			Commands.getCommand(message.split(" "));
		}
	}
});