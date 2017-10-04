'use strict';
var oroLite = angular.module("oroLite",[]);
oroLite.controller('indexCtrl', indexCtrl);

indexCtrl.$inject = ['$rootScope', '$scope', '$location', '$http', '$window'];

function indexCtrl($rootScope, $scope, $location,  $http, $window) {
	
	$scope.rel = "reload"

	$scope.login_block = false;
	$scope.admin_block = false;
	$scope.user_block = false;
	$scope.loggedIn = false;

	$scope.show_my_list_div = false;
	$scope.add_new_buddy_list_div = false;
	$scope.my_buddies_div = false;

	$scope.task_list_div = false;
	$scope.my_task_list_div = false;
	$scope.buddyList = [];
	$scope.tasks = [];
	$scope.myList = [];
	$scope.current_list = {};

	$scope.showMyListDiv = function() {
		$scope.show_my_list_div = true;
		$scope.add_new_nuddy_list_div = false;
		$scope.task_list_div = false;
	$scope.my_task_list_div = false;
		$scope.my_buddies_div = false;
	}

	$scope.showAddNewBuddyDiv = function() {
		$scope.show_my_list_div = false;
		$scope.add_new_nuddy_list_div = true;
		$scope.my_buddies_div = false;
	$scope.my_task_list_div = false;
		$scope.task_list_div = false;

	}

	$scope.showMyBuddiesDiv = function() {
		$scope.show_my_list_div = false;
		$scope.add_new_nuddy_list_div = false;
		$scope.my_buddies_div = true;
	$scope.my_task_list_div = false;
		$scope.task_list_div = false;

	}
	$scope.showTaskDiv = function() {
		$scope.show_my_list_div = false;
		$scope.add_new_nuddy_list_div = false;
		$scope.my_buddies_div = false;
		$scope.my_task_list_div = false;
		$scope.task_list_div = true;
	}
	$scope.showMyTaskDiv = function() {
		$scope.show_my_list_div = false;
		$scope.add_new_nuddy_list_div = false;
		$scope.my_buddies_div = false;
		$scope.my_task_list_div = true;
		$scope.task_list_div = false;
	}

	$scope.showLogin = function() {
		$scope.login_block = true;
		$scope.admin_block = false;
		$scope.user_block = false;
	}
	///// show-hide functions.
	$scope.showAdmin = function() {
		$scope.login_block = false;
		$scope.admin_block = true;
		$scope.user_block = false;
	}

	$scope.showUser = function() {
		$scope.login_block = false;
		$scope.admin_block = false;
		$scope.user_block = true;
	}

	$scope.initial_shows = function() {
		if (sessionStorage.getItem("login") !== null) {
			if (sessionStorage.getItem("login") === "yes") {
				$scope.loggedIn = true;
				if (sessionStorage.getItem("user_type") !== null && sessionStorage.getItem("user_type") === "admin") {
					$scope.showAdmin();
				}
				if (sessionStorage.getItem("user_type") !== null && sessionStorage.getItem("user_type") === "user") {

					$scope.showUser();
				}
			} else {
				$scope.showLogin();
			}
		} else {
			$scope.showLogin();
		}
	};
	$scope.initial_shows();

	$scope.logout = function() {
		sessionStorage.setItem("login", "no");
		sessionStorage.setItem("user_type", "none");
		$window.location.reload();


	}

	$scope.getInitialCheck = function(email,initial_password) {
		var data = {};
		if (!email || email.length === 0) {
			alert("Enter email to continue");
			return;
		}
		if (!initial_password || initial_password.length === 0) {
			alert("Enter password to proceed");
			return;
		}
		data.password = initial_password;
		data.email = email;
		$http.post('/v1/initial_checks/login', data).then(function (resp) {
			if (resp.data.status.response === "failure") {
				alert(resp.data.status.userMessage);
				return;
			}
				$scope.loggedIn = true;
				sessionStorage.setItem("login", "yes");
				sessionStorage.setItem("login_email", email);

			if (resp.data.data && resp.data.data.adminMode) {
				sessionStorage.setItem("user_type", "admin");
				$scope.showAdmin();
			} else {
				sessionStorage.setItem("user_type", "user");

				$scope.showUser();
			}
		});
	};

	$scope.addNewUser = function(email,initial_password) {
		var data = {};
		if (!email || email.length === 0) {
			alert("Enter email to continue");
			return;
		}
		if (!initial_password || initial_password.length === 0) {
			alert("Enter password to proceed");
			return;
		}
		data.password = initial_password;
		data.email = email;
		$http.post('/v1/initial_checks/addNewUser', data).then(function (resp) {
			
		alert(resp.data.status.userMessage);
		$window.location.reload();

							
		});
	};

	$scope.showMyList = function() {
		var email = sessionStorage.getItem("login_email");
		var data = {};
		data.email = email;
		$http.post('/v1/initial_checks/getMyList', data).then(function (resp) {
		$scope.myList  = resp.data.data;
		$scope.showMyListDiv();				
		});
	}

	$scope.addNewTask = function(new_task_name) {
		var data = {};
		if (!new_task_name || new_task_name.length === 0) {
			alert("Enter task name first to continue");
			return;
		}
		data.task_name = new_task_name;
		data.createdFor = $scope.current_list.createdFor;
	    data.createdBy = sessionStorage.getItem("login_email");
	    data.name = $scope.current_list.name;
	    $http.post('/v1/initial_checks/addNewTask', data).then(function (resp) {
			alert(resp.data.status.userMessage);
			$window.location.reload();
		});

	}

	$scope.addNewBuddyList = function(buddy_email,list_name) {
		var data = {};
		if (!buddy_email || buddy_email.length === 0) {
			alert("Enter Buddy's email first to continue");
			return;
		}
		if (!list_name || list_name.length === 0) {
			alert("Enter List name to continue");
			return;
		}
		data.createdFor = buddy_email;
	    data.createdBy = sessionStorage.getItem("login_email");
	    data.name = list_name;
	    $http.post('/v1/initial_checks/addNewList', data).then(function (resp) {
			alert(resp.data.status.userMessage);
			$window.location.reload();
		});
	}

	$scope.mybuddies = function() {
		var data = {};
		data.email = sessionStorage.getItem("login_email");
		
		$http.post('/v1/initial_checks/myBuddies', data).then(function (resp) {
			$scope.buddyList  = resp.data.data;
			$scope.showMyBuddiesDiv();
			
		});
	}

	$scope.showMyTasks = function(index) {
		$scope.tasks = [];
		$scope.tasks = index.tasks;
		$scope.current_list = index;
		$scope.showMyTaskDiv();
	}
	$scope.showTasks = function(index) {
		$scope.tasks = [];
		$scope.tasks = index.tasks;
		$scope.current_list = index;
		$scope.showTaskDiv();
	}

	$scope.markDone = function(taskName) {
		var data = {};

	    data.createdFor = sessionStorage.getItem("login_email");
	    data.name = $scope.current_list.name;
	    data.taskName = taskName;
	    alert("ajah")
	    $http.post('/v1/initial_checks/markItDone', data).then(function (resp) {
			alert(resp.data.status.userMessage);
			$window.location.reload();
			
		});
	}
}
