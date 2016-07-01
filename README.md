# TwitchBot.js

Welcome to TwitchBot!

Someday it'll actually do something maybe if everyone has enough freetime/drive to actually get it off the ground or whatever. As it stands the project uses DynamoDB as its backend.

## Setup

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
			"cluster": "mongodb",
			"reconnect": true
		},
		"identity": {
			"username": "INSERT BOT ACCOUNT NAME HERE",
			"password": "INSERT ACCOUNT OAUTH HERE"
		}, 
		"channels": ["INSET YOUR CHANNEL NAME HERE"]
	},
    "mongodb": {
        "url": "mongodb://localhost:27017/twitchbot"
    },
	"user": "INSERT YOUR USERNAME HERE"
}
```
* Replace the **INSERT** statements with the appropriate settings

* Run `npm install` to insall the required packages

* Run `node app.js` to start the bot

The bot should be running in the specified channel! :D