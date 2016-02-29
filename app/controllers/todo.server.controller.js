var mongoose = require('mongoose');

var Task = mongoose.model('Task');

function sendMsg(method, status, res){
	return { method : method, status : status, res : res };
}

module.exports = {
	add : function(req, res, next){
		var task = new Task(req.body);

		task.save(function(err, result){
			if(err){
				return next( sendMsg( 'add', 0, err ) );
			}

			return res.send( sendMsg( 'add', 1, result ) );
		});
	},
	getList : function(req, res, next){
		Task
		.find()
		.exec(function(err, results){
			if(err){
				return next( sendMsg( 'getList', 0, err ) )
			}

			return res.send( sendMsg( 'getList', 1, results ) );
		})
	},
	getById : function(req, res, next, id){
		if(!id){
			return next( new Error('Id number is required!') );
		}

		Task
		.findOne({_id : id})
		.exec(function(err,result){
			if(err){
				return next( err );
			}

			if(!result){
				return next( sendMsg('getById', 0, 'Not found!') )
			}

			req.task = result;
			return next();
		});
	},
	getByStatus : function(req, res, next, status){
		if( !status ){
			return next( new Error('Status is required!') );
		}
		req.task.status = status;
		return next();
	},
	set : function(req, res, next){
		
		var id = req.task._id;
		var status = req.task.status;

		if( id == '' || status == ''){
			return next( new Error('Parameter is missing'));
		}

		Task
		.findByIdAndUpdate(id, {$set:{status:status}} )
		.exec(function(err, result){
			
			if(err){
				return next( err );
			}

			return res.send( sendMsg('setStatus', 1, result) )
		});
	},
	remove : function(req, res, next){
		var id = req.task._id;

		if( id == '' ){
			return next( new Error('Parameter is missing') );
		}

		Task
		.findByIdAndRemove(id)
		.exec(function(err){
			if(err){
				return next(err);
			}

			return res.send( sendMsg('remove', 1, '已从数据库删除成功') )
		})
	},
	show : function(req, res, next){
		var id = req.task._id;

		if( id == '' ){
			return next( new Error('Parameter is missing') );
		}

		Task
		.findById(id)
		.exec(function(err, result){
			if(err){
				return next(err);
			}

			return res.send( sendMsg('remove', 1, result) );
		})
	}
}










