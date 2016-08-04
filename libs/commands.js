var mongoose = require('mongoose');
var Twitch = require('../libs/twitch.js');

var Commands = function () {};

Commands.prototype.createCmd = function(keyword, output){

  if (keyword.indexOf('!') !== 0){
    keyword = '!' + keyword;
  }

  var command = { 
    "keyword": keyword, 
    "output": output,
    "nonFollower": true,
    "follower": true,
    "subscriber": true,
    "moderator": true };
  var collection = mongoose.model('Command');

  collection.findOneAndUpdate( { "keyword": keyword }, command, {upsert:true}, function(err, doc){
    if (err) {
        console.error("insertItem failed:in collection command. Entry: " + JSON.stringify(keyword, null, 2) , ". Error JSON:", JSON.stringify(err, null, 2));
        Twitch.client.action(Twitch.botUser, "There was a problem adding command " + keyword);
     } else {
        console.log("insertItem succeeded in collection command. Entry: " + JSON.stringify(keyword, null, 2));
        Twitch.client.action(Twitch.botUser, "Command " + keyword + " added");
     }
  });
};

Commands.prototype.removeCmd = function(keyword){
  var collection = mongoose.model('Command');
  collection.find({ "keyword": keyword }).remove(function(){
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

module.exports = new Commands();