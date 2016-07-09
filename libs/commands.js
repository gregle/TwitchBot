var db = require('../libs/database.js');
var Twitch = require('../libs/twitch.js');

var Commands = function () {};

Commands.prototype.createCmd = function(keyword, output){

  if (keyword.indexOf('!') !== 0){
    keyword = '!' + keyword;
  }

  var entry = { "keyword": keyword, "output": output };

  db.insertUpdateItem("Commands", { "keyword": keyword }, { "output" : output }, function(){
    Twitch.client.action(Twitch.botUser, "Command " + keyword + " added");
  });
};

Commands.prototype.removeCmd = function(keyword){
  db.removeItem("Commands", { "keyword": keyword }, function(){
    Twitch.client.action(Twitch.botUser, "Command " + keyword + " removed");
  });
};

Commands.prototype.getCmdList = function(){
	return [];
};

module.exports = new Commands();