var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commandsSchema = new Schema( {
	keyword:		String,
	output:			String,
	nonFollower:	Boolean,
	follower:		Boolean,
	subscriber:		Boolean,
	moderator:		Boolean
});

mongoose.model('command', commandsSchema);