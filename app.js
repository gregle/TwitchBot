//load twitch messaging interface
var tmi=require('tmi.js');

//load Amazon Web Services
var AWS = require('aws-sdk');

//load the owner options
var options = require('./config.json');

//config the db for AWS
AWS.config.update(options.aws);

var botUser = options.user;

var dynamodb = new AWS.DynamoDB();

// A list of required database tables ( They can be empty but they need to be there )
var tableList = ['Commands', 'Viewers'];


// Create a Table in DynamoDB
var createDBTable = function(tablename, hashKey, rangeKey){
	var params = {
	    TableName : tablename,
	    KeySchema: [       
	        { AttributeName: hashKey.attributeName, KeyType: "HASH"},  //Partition key
	    ],
	    AttributeDefinitions: [       
	        { AttributeName: hashKey.attributeName, AttributeType: hashKey.attributeType }
	    ],
	    ProvisionedThroughput: {       
	        ReadCapacityUnits: 10, 
	        WriteCapacityUnits: 10
	    }
	};
	if (rangeKey !== null){
		params.KeySchema.concat({ AttributeName: rangeKey.attributeName, KeyType: "RANGE" });  //Sort key}
		params.AttributeDefinitions.concat({ AttributeName: rangeKey.attributeName, AttributeType: rangeKey.attributeType });
	}

	dynamodb.createTable(params, function(err, data) {
	    if (err) {
	        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
	        return;
	    } else {
	        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
	    }
	});
};

// Check to see if all the tables exist in the database and if they don't create them
dynamodb.listTables(function(err,data) {
	for (var i = 0; i < tableList.length; i++){
		console.log('\r\nChecking for ' + tableList[i] + ' table');
		if(data.TableNames.indexOf(tableList[i]) >= 0)
		{
			console.log(tableList[i] + ' exists');
		}
		else{
			console.log(tableList[i] + ' table missing; creating ' + tableList[i] + ' table');
			if(tableList[i] === 'Commands'){
				createDBTable(tableList[i], {attributeName: "keyword", attributeType: "S"}, null);
			}
			if(tableList[i] === 'Viewers'){
				createDBTable(tableList[i], {attributeName: "username", attributeType: "S"}, null);
			}
		}
	}
	console.log('All tables either exist or have been created \r\n');
});

var createCmd = function(keyword, output){
	console.log('keyword: ' + keyword + '\r\n' + 'output: ' + output);
	if (keyword.indexOf('!') !== 0){
		keyword = '!' + keyword;
	}
	var docClient = new AWS.DynamoDB.DocumentClient();
	var params = {
        TableName: "Commands",
        Item: {
            "keyword": keyword,
            "output": output
        }
    };

    docClient.put(params, function(err, data) {
    	console.log(data);
       if (err) {
           console.error("Unable to add command ", keyword, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded command: ", keyword);
           client.action(botUser, " The command " + " has been created!");
       }
    });
};

var getCmdList = function(){
	return [];
};

var cmdList = getCmdList();

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
		else if(msgArr[0] === "!lowco"){
			client.action(botUser, user ['display-name'] + ", she is the prettiest princess of them all!");
		}
		else if(msgArr[0] === "!koekies"){
			client.whisper(user['display-name'] + " you have no koekies!");
		}
		else{
			client.action(botUser, " That command does not exist you fool!");
		}
	}
});