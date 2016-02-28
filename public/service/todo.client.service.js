angular.module('todoList')
.service('TaskService',['$http', '$q', TaskService]);


function TaskService($http, $q){

	function handleRequest(method, url, data, callback){

		var defered = $q.defer();

		var config = {
			method : method,
			url : url
		};

		if( method == 'POST' ){
			config.data = data;
		}else if( method == 'GET' ){
			config.params = data;
		}

		$http( config ).success(function(data){
			defered.resolve(data);
		}).error(function(err){
			defered.reject(err);
		});

		callback && callback();

		return defered.promise;
	}

	return {
		getList : function( param ){
			return handleRequest('GET', '/list', param);
		},
		add : function( data, callback ){
			return handleRequest('POST', '/add', data, callback);
		},
		setStatus : function(data, callback){
			return handleRequest('GET', '/set/'+ data.id + '/' + data.status, callback);
		},
		remove : function(id){
			return handleRequest('GET','/remove/' + id);
		}
	}

}