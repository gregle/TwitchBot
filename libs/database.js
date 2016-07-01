// Database constructor
function Database () {
	//load Amazon Web Services
	this.AWS = require('aws-sdk');
}

// Initialize a new instance of our database
Database.prototype.init = function(options, tables){
	//config the db for AWS
	this.AWS.config.update(options);

	this.dynamodb = new this.AWS.DynamoDB();

	this.docClient = new this.AWS.DynamoDB.DocumentClient();

	// A list of required database tables ( They can be empty but they need to be there )
	this.tableList = tables;

	// Check to see if all the tables exist in the database and if they don't create them
	this.dynamodb.listTables(function(err,data) {
		for (var i = 0; i < tables.length; i++){
			console.log('\r\nChecking for ' + tables[i] + ' table');
			if(data.TableNames.indexOf(tables[i]) >= 0)
			{
				console.log(tables[i] + ' exists');
			}
			else{
				console.log(tables[i] + ' table missing; creating ' + tables[i] + ' table');
				if(tables[i] === 'Commands'){
					createDBTable(tableList[i], {attributeName: "keyword", attributeType: "S"}, null);
				}
				if(tables[i] === 'Viewers'){
					createDBTable(tables[i], {attributeName: "username", attributeType: "S"}, null);
				}
			}
		}
		console.log('All tables either exist or have been created \r\n');
	});
};

// Create a Table in DynamoDB
Database.prototype.createDBTable = function(tableName, hashKey, rangeKey){
	var params = {
	    TableName : tableName,
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

	this.dynamodb.createTable(params, function(err, data) {
	    if (err) {
	        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
	        return;
	    } else {
	        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
	    }
	});
};

Database.prototype.putItem = function(tableName, Entry){
	var params = {
        TableName: tableName,
        Item: Entry
    };

    this.docClient.put(params, function(err, data) {
    	console.log(data);
       if (err) {
           console.error("PutItem failed:in table ", tableName + "Entry: " + JSON.stringify(Entry, null, 2) , ". Error JSON:", JSON.stringify(err, null, 2));
       		// TODO SEND NOTICE TO OUTPUT MODULE
       } else {
           console.log("PutItem succeeded in table ", tableName + "Entry: " + JSON.stringify(Entry, null, 2));
           // TODO SEND NOTICE TO OUTPUT MODULE
       }
    });
};

//return the contents of a table
Database.prototype.getItem = function(tableName, keys, callback){
	var params = { 
	    TableName: tableName,
	    Key: keys
	};
	this.docClient.get(params, callback);
};

module.exports = Database;