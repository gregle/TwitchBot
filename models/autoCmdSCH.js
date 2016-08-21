var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var autoCmdSchema = new Schema( {
	keyword:		String,
	params:			String,
	minutes:		Number,
	chatCount:		Number,
	online:			Boolean,
	offline:		Boolean
});

mongoose.model('AutoCmd', autoCmdSchema);