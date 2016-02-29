angular.module('todoList')
.controller('taskCtrl',['$scope', '$timeout', 'TaskService', TaskController]);

function TaskController($scope, $timeout, TaskService){

	// 新建任务
	$scope.task = {
		title : '',
		content : ''
	};
	// 全部任务
	$scope.tasks = [];
	// 未完成
	$scope.defaulted = [];
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
		deleted : 0,
		defaulted : 0
	}
	// 当前正在查看的某一条
	$scope.current = {};

	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		}else {
			this.$apply(fn);
		}
	};

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

		// 插入数据库
		TaskService.add( task );
		// input置为空
		$scope.task = {
			title : '',
			content : ''
		};
	}

	$scope.setStatus = function(param){

		$('[data-toggle="tooltip"]').tooltip('hide');

		// 插入成功队列
		TaskService.setStatus( param );

		$scope.getList();
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
		$scope.countNum.defaulted = 0;
		
		for(var i = 0; i < $scope.tasks.length; i++){
			switch( $scope.tasks[i].status  ){
				case 'complete':
					$scope.countNum.completed += 1;
					break;
				case 'delete':
					$scope.countNum.deleted += 1;
					break;
				case 'default':
					$scope.countNum.defaulted += 1;
			}
		}
	};


	$scope.formatTime = function(date){

		console.log(date);
		var time = moment(date).format('YYYY-MM-DD');
		return time;
	}

	$scope.openDetail = function(id){
		$scope.showTask(id);
		$('#modal-detail').modal('show');
	}

	$scope.showTask = function(id){
		
		TaskService.show(id).then(function(data){
			$scope.current = data.res;
		},function(err){
			console.log(err);
		});
	}

	// 单条 是否选中
	$scope.isSelect = function( $event ){
		var checkBox = $event.target;
		$scope.checked = checkBox.checked ? true : false;
	}

	$scope.$watch('tasks',function(newValue,oldValue, scope){

	    $scope.count();

	});

	$scope.getList();
}