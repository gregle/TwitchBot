var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quotesSchema = new Schema( {
	id:		Number,
	quote:	String,
	attr:	String,
	date:	Date
});

mongoose.model('quote', quotesSchema);