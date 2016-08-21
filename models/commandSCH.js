var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commandSchema = new Schema( {
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

mongoose.model('Command', commandSchema);