angular.module('todoList')

.controller('taskCtrl', function($scope, $interval, ConfigService, TaskService){

	$scope.config = ConfigService;

	$scope.showlayer = false;

	$scope.showLayer = function(){
		$scope.showlayer = !$scope.showlayer;
	}

	// 新建任务
	$scope.task = {
		title : '',
		content : '',
		deadline : ''
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
	// 倒计时
	$scope.countTime = { d : 0, h : 0, m : 0, s : 0 };

	// 统计
	$scope.countNum = {
		completed : 0,
		deleted : 0,
		defaulted : 0,
		selected : 0
	}
	// 当前正在查看的某一条
	$scope.current = {};

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

	function countDown( nextDate ){

		var now = new Date().getTime();
		var next = new Date(nextDate).getTime();

		if( next < now ){
			$scope.countTime = { d : 0, h : 0, m : 0, s : 0 }
			return false;
		}

		var t = Math.abs( parseInt( (next - now) / 1000) );

		var d = Math.floor(t / 60 / 60 / 24);
	    var h = Math.floor(t / 60 / 60 % 24);
	    var m = Math.floor(t / 60 % 60);
	    var s = Math.floor(t % 60);

		$scope.countTime = { d : d, h : h, m : m, s : s }
	}

	// 获取列表
	$scope.getList = function(param){

		TaskService.getList(param).then(function(data){

			$scope.tasks = data.res;

			$scope.count();

			for(var i = 0; i < $scope.tasks.length; i++){
				$scope.tasks[i].checked = false;
			}

		},function(err){
			msg( 'error', err );
		});
	}

	$scope.save = function(){

		// 任务非空
		if( $scope.task.title == '' || $scope.task.content == '' || $scope.task.deadline == '' ){
			msg( 'danger', '所有项目均为必填项...' );
			return false;
		}

		$scope.Msg = '';

		// 次日凌晨
		var dealine = new Date( $scope.task.deadline );
		dealine.setDate( dealine.getDate()+1, 0, 0, 0 );

		var task = {
			title : $scope.task.title,
			content : $scope.task.content,
			deadline : dealine,
			status : 'default'
		}

		// 插入数据库
		TaskService.add( task ).then(function(response){
			$scope.tasks.push( response.res );
		});
	}

	// 设置服务器端状态
	$scope.setStatus = function(param){

		$('[data-toggle="tooltip"]').tooltip('hide');

		// 设置服务端状态
		TaskService.setStatus( param );
		// 更新本地状态
		$scope.updateStatus(param);
	};

	// 更新本地状态
	$scope.updateStatus = function(param){
		for(var i = 0; i < $scope.tasks.length; i++){
			if( $scope.tasks[i]._id == param.id ){
				$scope.tasks[i].status = param.status;

				$scope.count();
			}
		}
	}

	// 服务器端操作删除
	$scope.remove = function(id){

		TaskService.remove( id );

		window.location.reload();
	};


	// 操作全部列表 选中状态 (all / reverse / zero)
	$scope.selectedAll = function( method, status ){

		for(var i = 0; i < $scope.tasks.length; i++){
			switch( method ){
				case 'all':
					$scope.countNum.selected = $scope.tasks.length;
					$scope.tasks[i].checked = true;
					break;
				case 'reverse':
					$scope.tasks[i].checked = !$scope.tasks[i].checked;
					$scope.countNum.selected = Math.abs($scope.tasks.length - $scope.countNum.selected);
					break;
				case 'zero':
					$scope.countNum.selected = 0;
					$scope.tasks[i].checked = false;
					break;
			}
		}
	};

	// 多选设置
	$scope.setAll = function(status){
		for(var i = 0; i < $scope.tasks.length; i++){

			if( status && ( $scope.tasks[i].checked == true ) ){
				$scope.setStatus( {id : $scope.tasks[i]._id, status : status} );
			}
		}
	}

	// 多选删除
	$scope.selectRemove = function(){
		for(var i = 0; i < $scope.tasks.length; i++){

			if( $scope.tasks[i].checked == true ){

				$scope.remove( $scope.tasks[i].id );
			}
		}
	}

	// 本地计数
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

	// 格式化日期
	$scope.formatTime = function(date){
		var time = moment(date).format('YYYY-MM-DD HH:ss');
		return time;
	}

	// 打开弹层
	$scope.openDetail = function(id){
		$scope.showTask(id);
		$('#modal-detail').modal('show');
	}

	// 显示详细信息
	$scope.showTask = function(id){
		
		TaskService.show(id).then(function(data){
			$scope.current = data.res;

			$interval( function(){
				countDown( $scope.current.deadline )
			}, 1000 );

		},function(err){
			console.log(err);
		});
	}

	// 单条 是否选中
	$scope.isSelect = function( id ){
		for(var i = 0; i < $scope.tasks.length; i++){
			if($scope.tasks[i]._id = id){
				$scope.checked = !$scope.checked;

				if( $scope.checked == true ){
					$scope.countNum.selected++;
				}else{
					$scope.countNum.selected--;
				}
			}
		}
	}

	// 初始化项目列表
	$scope.getList();
});