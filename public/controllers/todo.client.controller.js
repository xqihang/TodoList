angular.module('todoList')
.controller('taskCtrl',['$scope', 'TaskService', TaskController]);

function TaskController($scope, TaskService){

	// 新建任务
	$scope.task = {
		title : '',
		content : ''
	};
	// 正在进行中
	$scope.tasks = [];
	// 完成列表
	$scope.completed = [];
	// 已删除列表
	$scope.deleted = [];
	// 单条消息 最后一条
	$scope.Msg = {status:'success', msg:''};
	// 消息队列 备用
	$scope.ArrMsg = [];
	// 是否全选
	$scope.isSelectedAll = false;
	// 统计
	$scope.countNum = {
		completed : 0,
		deleted : 0
	}

	function msg( status, msg ){

		var message = {
			status: status || 'success',
			msg: msg  || ''
		};

		// 显示最后一条信息
		$scope.Msg = message;
		// 插入通知队列
		$scope.ArrMsg.push( message );
		// 打印通知消息
		console.log( message );
	}

	$scope.getList = function(param){

		TaskService.getList(param).then(function(data){
			$scope.tasks = data.res;
		},function(err){
			msg( 'success', err );
		});
	}

	$scope.save = function(){

		// 任务非空
		if( $scope.task.title == '' || $scope.task.content == '' ){
			msg( 'danger', '所有项目均为必填项...' );
			return false;
		}

		var task = {
			title : $scope.task.title,
			content : $scope.task.content,
			deadline : new Date().setDate(new Date().getDate()+5)
		}

		// 插入队列
		TaskService.add( task, function(){
			// 打印消息
			msg( 'success', '任务 [ '+ $scope.task.title +' ] 创建成功...' );
		});
		// input置为空
		$scope.task = {
			title : '',
			content : ''
		};
	}

	$scope.setStatus = function(param){

		$('[data-toggle="tooltip"]').tooltip('hide');

		// 插入成功队列
		TaskService.setStatus(param, function(){
			// 打印消息
			msg( 'success', '任务 '+ param.id +' : 已完成 ...' );
		});
	};

	$scope.remove = function(id){

		TaskService.remove( id );
	}


	// 操作全部列表 选中状态 (all / reverse / zero)
	$scope.selectedAll = function( method ){

		for(var i = 0; i < $scope.tasks.length; i++){
			switch( method ){
				case 'all':

					$scope.tasks[i].checked = true;
					break;
				case 'reverse':
					$scope.tasks[i].checked = !$scope.tasks[i].checked;
					break;
				case 'zero':
					$scope.tasks[i].checked = false;
			}
		}
	}

	$scope.count = function(){
		
		$scope.countNum.completed = 0;
		$scope.countNum.deleted = 0;
		
		for(var i = 0; i < $scope.tasks.length; i++){
			switch( $scope.tasks[i].status  ){
				case 'complete':
					$scope.countNum.completed += 1;
					break;
				case 'delete':
					$scope.countNum.deleted += 1;
					break;
			}
		}
	};

	// 单条 是否选中
	$scope.isSelect = function( $event ){
		var checkBox = $event.target;
		$scope.checked = checkBox.checked ? true : false;
	}

	$scope.$watch('tasks', function(){
		$scope.count();
		$scope.getList();
	});

	$scope.getList();
	$('[data-toggle="tooltip"]').tooltip();
}