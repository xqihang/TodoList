angular.module('todoList')
.service('TaskService',['$http', '$q', TaskService]);


function TaskService($http, $q){

	function handleRequest(method, url, data){

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

		$http( config, { cache: true } ).success(function(data){
			defered.resolve(data);
		}).error(function(err){
			defered.reject(err);
		});

		return defered.promise;
	}

	return {
		getList : function( param ){
			return handleRequest('GET', '/list', param);
		},
		add : function( data, callback ){
			return handleRequest('POST', '/add', data);
		},
		setStatus : function(data, callback){
			return handleRequest('GET', '/set/'+ data.id + '/' + data.status);
		},
		remove : function(id){
			return handleRequest('GET','/remove/' + id);
		},
		show : function(id){
			return handleRequest('GET','/show/' + id);
		}
	}

}