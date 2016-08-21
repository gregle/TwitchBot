var mongoose = require('mongoose');
var Twitch = require('../libs/twitch.js');

//Processes the command string and fills in the variables
//str='this is a {0} response, {1}'' arg=['example', 'gregle' ]  
var processString = function(str, args){
  if(str === ""){return " ";}
  console.log(str + args);
  var output = str;
  for(var i = 0; i < args.length; i++){
    var re = new RegExp('{('+ i +')}', 'g');
    output = output.replace(re, args[i]);
  }
  var removePlaceholders = new RegExp('{([0-9])}', 'g');
  output = output.replace(removePlaceholders, '');
  return output;
};

var Commands = function () {};

//Create a command and push it into the DB
Commands.prototype.createCmd = function(keyword, output){
  //Ensure the keyword starts with an exclamation mark
  if (keyword.indexOf('!') !== 0){
    keyword = '!' + keyword;
  }

  //Create and insert a command
  var command = { 
    "keyword": keyword, 
    "output": output,
    "nonFollower": true,
    "follower": true,
    "subscriber": true,
    "moderator": true };
  var commands = mongoose.model('Command');

  commands.findOneAndUpdate( { "keyword": keyword }, command, {upsert:true}, function(err, doc){
    if (err) {
        console.error("insertItem failed:in collection command. Entry: " + JSON.stringify(keyword, null, 2) , ". Error JSON:", JSON.stringify(err, null, 2));
        Twitch.sendChatMsg("There was a problem adding command " + keyword);
     } else {
        console.log("insertItem succeeded in collection command. Entry: " + JSON.stringify(keyword, null, 2));
        Twitch.sendChatMsg("Command " + keyword + " added");
     }
  });
};

//Removes a command from the DB
Commands.prototype.removeCmd = function(keyword){
  var commands = mongoose.model('Command');
  commands.find({ "keyword": keyword }).remove(function(){
    Twitch.sendChatMsg("Command " + keyword + " removed");
  });
};

Commands.prototype.getCommand = function(msgArr){
  mongoose.model('Command').find({"keyword": msgArr[0]}, function(err, data) {
      if (err) { Twitch.sendChatMsg('There was a problem'); console.log(err);}
      else {
          if(data.length > 0) {
            Twitch.sendChatMsg(processString(data[0].output, msgArr.slice(1)));
          }
      }
  });
};
module.exports = new Commands();