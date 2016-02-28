var TaskController = require('../controllers/todo.server.controller');

module.exports = function(app){


	app.route('/list')
	.get( TaskController.getList );

	app.route('/add')
	.post( TaskController.add );

	app.route('/set/:id/:status')
	.get( TaskController.set );

	app.route('/remove/:id')
	.get( TaskController.remove );

	app.param('id', TaskController.getById );
	app.param('status', TaskController.getByStatus );
}