var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
	title : String,
	content : String,
	createTime : {
		type : Date,
		default : Date.now
	},
	deadline : {
		type : Date,
		default : null
	},
	status : {
		type : String,
		default : 'default'
	}
});

var Task = mongoose.model('Task', TaskSchema );