var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quoteSchema = new Schema( {
	id:		Number,
	quote:	String,
	attr:	String,
	date:	Date
});

mongoose.model('Quote', quoteSchema);