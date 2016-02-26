var express = require('express');

module.exports = function(){

	// 实例化express
	var app = express();

	// 使用中间件挂载静态目录
	app.use( express.static('./public') );

	// 设置404
	app.use(function(req, res, next){
		res.status = 404;
		try{
			return res.json('Not Found...');
		}catch(e){
			console.Error('404 set header after send...');
		}
	});

	// 导出express
	return app;
}