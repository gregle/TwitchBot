# TwitchBot.js

Welcome to TwitchBot!

Someday it'll actually do something maybe if everyone has enough freetime/drive to actually get it off the ground or whatever. As it stands the project uses MongoDB as its backend.

## Quick Start Setup

* Install MongoDB: https://www.mongodb.com/

* Clone the repo: `git clone https://github.com/gregle/TwitchBot.git`

* Create a file called "config.json" which contains the below JSON configuration:

```json
{	
	"twitch": {
		"options": { 
			"debug": true 
		},
		"connection": {
			"reconnect": true
		},
		"identity": {
			"username": "INSERT BOT ACCOUNT NAME HERE",
			"password": "INSERT ACCOUNT OAUTH HERE"
		}, 
		"channels": ["#INSET YOUR CHANNEL NAME HERE"],
		"clientID": "9zc8p1u5dh27fcd1uwse9w00210d2ri",
        "statusCheckRate": 5
    },
    "currency": {
        "name": "INSERT YOUR CURRENCY NAME HERE",
        "onlineRate": 15,
        "offlineRate": 30,
        "amountPerTick": 1
    },
    "audience": {
        "updateRate": 1
    },
    "MongoDBURI": "mongodb://localhost/twitchbot"
}
```
* Replace the **INSERT** statements with the appropriate settings

* Run `npm install` to insall the required packages

* Run `node app.js` to start the bot

The bot should be running in the specified channel! :D

## Default/Reserved Commands

### Custom Commands

#### USAGE
	!{command-name} {optional-argument0} ...
Will call the command with the keyword {command-name} and insert the {optional-arguments} into the response.

	!caps
	!caps Gregle
	!loveLetter Gregle NotGregle

Any extra variables will not be included.  
Missing variables will mean nothing is inserted in the   placeholder.  
Variables can't be skipped.  

#### ADD (mods/streamer only)
	!command add !{KEYWORD} {COMMAND RESPONSE}	
Creates a custom command with the defined {keyword} that returns the defined {response}.

Command Response can have variables inserted into it using {index} to define location.

	!command add !caps {0}, DON'T WRITE IN CAPS 
	//when called with:
	!caps Gregle 
	//will return:
	Gregle, DON'T WRITE IN CAPS 

You can have an unlimited number of variables and reuse those variables throughout the message. It is a good practice to include the optional variables last since there isn't a way to skip variables during usage.

	!command add !loveLetter Dear {0}, I think you're cute {0}. Love {1} 
	//when called with:
	!loveLetter Gregle NotGregle 
	//will return:
	Dear Gregle, I think you're cute Gregle. Love NotGregle

#### EDIT (mods/streamer only)
Adding a new custom command with the same {keyword} as an existing custom command will overwrite the previous one.

#### REMOVE (mods/streamer only)
	!command rem !{KEYWORD}
Removes the command with the defined {keyword}.

### CURRENCY

#### VIEW TOTAL
	!{currency-name}
Will display the invoking user's currency.
	//when called with:
	!whatevers
	//will return:
	gregle has 4260 whatevers and has spent 7 Days 9 Hours 35 Minutes here!

#### VIEW OTHER'S TOTAL (mods/streamers only)
	!{currency-name} {target}
Will display the {target} user's currency.
	//when called with:
	!whatevers notGregle
	//will return:
	notGregle has 4260 whatevers and has spent 7 Days 9 Hours 35 Minutes here!

#### ADD (mods/streamers only)
	!{currancy-name} add {target} {amount}
Give {target} user a defined {amount} currency.
	//when called with:
	!whatevers add Gregle 100
	//will return:
	100 whatevers given to gregle.

	!{currancy-name} add all {amount}
Give all users a defined {amount} currency.
	//when called with:
	!whatevers add all 100
	//will return:
	100 whatevers given to all.

#### REMOVE (mods/streamers only)
	!{currancy-name} rem {target} {amount}
	//when called with:
Take from {target} user a defined {amount} of currency.
	!EX: !whatevers rem Gregle 100
	//will return:
	100 whatevers taken from gregle.

	!{currancy-name} rem all {amount}
Take from all users a defined {amount} of currency.
	//when called with:
	!whatevers rem all 100
	//will return:
	100 whatevers taken from all.

### MISC
	!bot
	//returns: My purpose is unknown.  

Describes the bot origin

	!firstSeen
	//returns: gregle was first seen on Sun Aug 21 2016

Returns when the user was first seen in chat

	!parrot {phrase}
	//returns: {phrase}

The bot echos word for word the message it was sent

	!uptime
	//returns: gregle has been live for 2 Hours 48 Minutes 9 Seconds

Returns the current uptime of the stream

	//(mods/streamers only)
	!toptrolls
	//returns: {list of the 5 users with the most timeouts}

Returns a list of the 5 users who have received the most timeouts
	