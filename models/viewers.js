var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var viewersSchema = new Schema( {
	name: 			String,
	currancy: 		Number,
	timeWatched: 	Number,
	moderator: 		Boolean,
	whitelist: 		Boolean,
	subscriber: 	Boolean
});

mongoose.model('viewers', viewersSchema);