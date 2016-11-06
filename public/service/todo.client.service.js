angular.module('todoList')

.service('ConfigService',['$http', '$q', ConfigService])

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
		add : function( data ){
			return handleRequest('POST', '/add', data);
		},
		setStatus : function( data ){
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

function ConfigService(){

	return {
		lang : 'zh',
		altText : {
			appName : {
				zh : '任务列表系统',
				en : 'TodoList System'
			},
			taskTitle : {
				zh : '任务标题',
				en : 'Task Title'
			},
			taskDate : {
				zh : '任务截止日期',
				en : 'Task deadline Date'
			},
			taskContent : {
				zh : '详细任务介绍',
				en : 'Task Content Text'
			},
			taskList : {
				zh : '详细列表',
				en : 'Task List'
			},
			delete : {
				zh : '彻底删除',
				en : 'Delete this task'
			},
			complete : {
				zh : '完成',
				en : 'Complete this task'
			},
			trash : {
				zh : '放入垃圾桶',
				en : 'Add this task to Trash site'
			},
			again : {
				zh : '重新打开任务',
				en : 'Again this task'
			},
			allChoose : {
				zh : '全选',
				en : 'All Choose'
			},
			inverseChoose : {
				zh : '反选',
				en : 'Inverse Choose'
			},
			notChoose : {
				zh : '不选',
				en : 'Not Choose'
			}
		}
	}
}