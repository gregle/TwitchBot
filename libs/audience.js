var db = require('../libs/database.js');
var Twitch = require('../libs/twitch.js');
var Currency = require('../libs/currency.js');

var Audience = function () {};

Audience.prototype.createUpdateMember = function(_name, status){
	var viewer = { 
		name: _name,
	};

	/*db.insertUpdateItem("viewer", { "name": _name }, viewer, function(){
		Twitch.client.action(Twitch.botUser, "User " + _name + " added");
	});*/
};

module.exports = new Audience();