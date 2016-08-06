var db = require('../libs/database.js');
var Twitch = require('../libs/twitch.js');
var Audience = require('../libs/audience.js');
var options = require('../config.json').currency;


var currencyTimer = function(){
	getViewerList('gregle',function (users){
		
		console.log(users);
	});
};

//setInterval(currencyTimer, 1000 * 60 * Currency.options.onlineRateMinutes);

var Currency = function () {};

Currency.prototype.options = options;
Currency.prototype.modifyCurrency = function(target, amount){

};

Currency.prototype.removeCurrency = function(keyword){

};

//str='this is a {0} response, {1}'' arg=['example', 'gregle' ]  
Currency.prototype.returnCurrencyCount = function(viewer, args){
	/*db.getItem("viewer", { "name": viewer },function(err, data) {
		if (err) { Twitch.client.action(botUser, 'There was a problem'); }
		else {
			if(data.length > 0) { 
				var output = " has, " + data[0].currency + CurrencyName;
				Twitch.client.action(botUser, output);
			}
		}
	});*/
};

module.exports = new Currency();