var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var viewersSchema = new Schema( {
	name: 			String,
	currency: 		{type: Number, default: 0},
	timeWatched: 	{type: Number, default: 0},
	moderator: 		{type: Boolean, default: false},
	whitelist: 		{type: Boolean, default: false},
	subscriber: 	{type: Boolean, default: false},
	lastSeen: 		{type: Date, default: Date.now}
});

mongoose.model('viewer', viewersSchema);