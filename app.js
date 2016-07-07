//load twitch messaging interface
var tmi=require('tmi.js');

// Load Modules and Configuration
var options = require('./config.json');
var Database = require('./libs/database.js');
var Commands = require('./libs/commands.js');


var botUser = options.user;

// A list of required database tables ( They can be empty but they need to be there )
var tableList = ['Commands', 'Viewers'];

var db = new Database();
db.init(tableList);

var createCmd = function(keyword, output){

	if (keyword.indexOf('!') !== 0){
		keyword = '!' + keyword;
	}

	var entry = { "keyword": keyword, "output": output };

	db.insertUpdateItem("Commands", { "keyword": keyword }, { "output" : output });
};


//create a new tmi client
var client = new tmi.client(options.twitch);
client.connect();

client.on("connected", function(address, port)	{
	client.action(botUser, "Hello world.");
});

client.on('chat', function(channel, user, message, self){
	//if the first oart of the message is an exclimation mark it's probably a command
	if(message.indexOf('!') === 0){
		//split the message the first value will be the command, subsiquent values will be the arguments
		var msgArr = message.split(" ");
		if(msgArr[0] === "!command"){
			// Username is a mod or username is the broadcaster..
			if (user["user-type"] === "mod" || user.username === channel.replace("#", "")){
				if (msgArr[1] && msgArr[1] === 'create'){
					createCmd( msgArr[2], message.substring( message.indexOf ( msgArr[2] + ' ' ) + msgArr[2].length ));
				}
			}
			else{
				client.action(user ['display-name'] + ", only mods can use that command");
			}
		}
		else if(msgArr[0] === "!bot"){
			client.action(botUser, " My purpose is unknown.");
		}
		else{
			db.getItem("Commands", {"keyword": msgArr[0]}, function(err, data) {
			    if (err)
			        client.action(botUser, 'There was a problem');
			    else
			        if(data.length > 0) {client.action(botUser, data[0].output);}
			});
		}
	}
});