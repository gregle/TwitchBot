var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commandsSchema = new Schema( {
	keyword:{
		type: String,
		unique: true
	},
	output:			String,
	nonFollower:	Boolean,
	follower:		Boolean,
	subscriber:		Boolean,
	moderator:		Boolean
});

var Command = mongoose.model('Command', commandsSchema);

module.exports = Command;