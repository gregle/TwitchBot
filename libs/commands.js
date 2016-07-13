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

//str='this is a {0} response, {1}'' arg=['example', 'gregle' ]  
Commands.prototype.processString = function(str, args){
  var output = str;
  for(var i = 0; i < args.length; i++){
    var re = new RegExp('{('+ i +')}', 'g');
    output = output.replace(re, args[i]);
  }
  return output;
};

Commands.prototype.getCmdList = function(){
  return [];
};

module.exports = new Commands();