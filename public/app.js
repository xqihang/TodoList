var app = angular.module('todoList',[]);

app.controller('taskCtrl', function($scope){

	// 新建任务
	$scope.task = '';
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

	function updateDelTasks( index ){

		// 临时队列
		var tmp = [];
		
		for( var i in $scope.tasks ){
			// index不匹配不插入临时队列
			if(i != index){
				tmp.push( $scope.tasks[i] )
			}
		}
		// 返回操作 删除某任务后 的队列
		return tmp;
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

	$scope.save = function(){

		// 任务非空
		if( !$scope.task ){
			msg( 'danger', '任务内容为必填项...' );
			return false;
		}

		// 打印消息
		msg( 'success', '任务 [ '+ $scope.task +' ] 创建成功...' );
		// 插入队列
		$scope.tasks.push( $scope.task );
		// input置为空
		$scope.task = '';
	}

	$scope.complete = function(index){

		// 插入成功队列
		$scope.completed.push( $scope.tasks[index] );
		// 打印消息
		msg( 'success', '任务 '+ $scope.tasks[index] +' : 已完成 ...' );
		// 更新任务列表
		$scope.tasks = updateDelTasks( index );
	};

	$scope.del = function(index){

		// 插入删除队列
		$scope.deleted.push( $scope.tasks[index] );

		// 打印消息
		msg( 'warning', '任务 '+ $scope.tasks[index] +' : 删除成功 ...' );

		// 更新任务列表
		$scope.tasks = updateDelTasks( index );
	}

});