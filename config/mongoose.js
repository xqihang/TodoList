var mongoose = require('mongoose');

var config = require('../config/config');

module.exports = function(){

	var db = mongoose.connect( config.mongodb );

	require('../app/models/todo.server.model');

	return db;
}