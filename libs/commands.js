//load Amazon Web Services
var AWS = require('aws-sdk');

var Commands = function () {};

Commands.prototype.createCmd = function(keyword, output, twitchClient){
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
    var result = false;
    docClient.put(params, function(err, data) {
    	console.log(data);
       if (err) {
           console.error("Unable to add command ", keyword, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded command: ", keyword);
           result = true;
       }
	});
	return result;
};

Commands.prototype.getCmdList = function(){
	return [];
};

Commands.prototype.log = function () {
  console.log('buz!');
};

module.exports = new Commands();