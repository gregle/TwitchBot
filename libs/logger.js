var Logger = function () {};

getTimeString = function(){
  var date = new Date();
  return "[" + date.getHours() + ":" + date.getMinutes() + "]";
};

Logger.prototype.log = function(msg){
  
  console.log("%s twitch bot: %s", getTimeString() ,msg);
};

Logger.prototype.error = function(msg){
  console.log("%s !twitch bot ERROR!: %s", getTimeString(), msg);
};

module.exports = new Logger();