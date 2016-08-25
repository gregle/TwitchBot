var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memberSchema = new Schema( {
	name: 			String,
	currency: 		{type: Number, default: 0},
	timeWatched: 	{type: Number, default: 0},
	timeouts:		{type: Number, default: 0},
	moderator: 		{type: Boolean, default: false},
	lastSeen: 		{type: Date, default: Date.now},
	firstSeen: 		{type: Date, default: Date.now}
});

mongoose.model('Member', memberSchema);