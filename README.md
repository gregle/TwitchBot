# WollowBot.js

Welcome to WollowBot!

Someday it'll actually do something maybe if everyone has enough freetime/drive to actually get it off the ground or whatever. As it stands the project uses DynamoDB as its backend.

## Setup

* Clone the repo: `git clone https://github.com/DegoBear/wollowbot.git`

* Create a file called "config.json" which contains the below JSON configuration:

```json
{	
	"twitch": {
		"options": { 
			"debug": true 
		},
		"connection": {
			"cluster": "aws",
			"reconnect": true
		},
		"identity": {
			"username": "INSERT BOT ACCOUNT NAME HERE",
			"password": "INSERT ACCOUNT OAUTH HERE"
		},
		"channels": ["INSET YOUR CHANNEL NAME HERE"]
	},
	"aws": {
		"accessKeyId": "INSERT DynamoDB ACCESS KEY HERE",
		"secretAccessKey": "INSERT DynamoDB SECRET ACCESS KEY HERE",
		"region": "us-west-2"
	},
	"user": "INSERT YOUR USERNAME HERE"
}
```
* Replace the **INSERT** statements with the appropriate settings
	- To get your DynamoDB Keys you'll need to us the Identity and Access Management (IAM) Console withing AWS to generate one

* Run `npm install` to insall the required packages

* Run `node app.js` to start the bot

The bot should be running in the specified channel! :D