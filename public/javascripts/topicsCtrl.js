'use strict';
var oroLite = angular.module("oroLite",[]);
oroLite.controller('topicsCtrl', topicsCtrl);

topicsCtrl.$inject = ['$rootScope', '$scope', '$location', '$http', '$window'];

function topicsCtrl($rootScope, $scope, $location,  $http, $window) {
	$scope.showme = false;
	$scope.loading = false;
	$scope.showIfa = true;
	$scope.showClients = false;
	$scope.lost = ['aba','ababa','affaf'];
	$scope.values = [];
	$scope.clientVales = [];
	$scope.ifas1 = [];

	$scope.modifyMe = function(i,site_name,site_link,img_link,back_color) {
		 console.log(i);
		 console.log($scope.values[i].key);
		var data = {};
		if (site_name === "{{ifa.name}}") {
			site_name = $scope.values[i].name;
		}
		if (site_link === "{{ifa.link}}") {
			site_link = $scope.values[i].link;
		}
		if (img_link === "{{ifa.img_link}}") {
			img_link = $scope.values[i].img_link;
		}
		if (back_color === "{{ifa.back_color}}") {
			back_color = $scope.values[i].back_color;
		}
		data.site_name = site_name;
		data.site_link = site_link;
		data.img_link = img_link;
		data.key = $scope.values[i].key;
		data.back_color = back_color;
		console.log(data.key);
		console.log("guyjhnkl+ " +i);
		console.log("guyjhnkl+ " + site_name);
		console.log("guyjhnkl+ " + site_link);
		console.log("guyjhnkl+ " + img_link);
		$http.post('/v1/sites/updateInfo', data).then(function (resp) {
			console.log(resp.data);
			$window.location.reload();
		});

	}
		$scope.deleteMe = function(i) {
		var data = {};
		data.key = $scope.values[i].key;
		$http.post('/v1/sites/updateInfo', data).then(function (resp) {
			console.log(resp.data);
			$window.location.reload();
		});

	}
/*
	$scope.getBack = function() {
		
		$scope.loading = false;
		$scope.showIfa = true;

	$scope.showClients = false;
	}*/

	$scope.fetchClients = function(i) {
		var data = {
			ifaUniqueId : $scope.values[i].uniqueId
		}
		console.log(data);

		$http.post('/v1/sites/siteList', data).then(function (resp) {
			console.log(resp.data);
			$scope.clientVales = [];
		//$scope.values = resp.data ;
		$scope.ifas1 = resp.data.data; 
		if (resp.data.status.response === "failure") {
			alert(resp.data.status.message);
		} else {
			for (var i = 0; i < $scope.ifas1.clientSearchList.length; i++) {
			var a = {};
			//a.clientUniqueId = $scope.ifas1[i].clientUniqueId;
			a.name = $scope.ifas1.clientSearchList[i].name;
			a.emailId = $scope.ifas1.clientSearchList[i].email;
			a.paymentStatus = $scope.ifas1.clientSearchList[i].ifa.paymentStatus;
			console.log(a.paymentStatus);
			//a.mobile = $scope.ifas1[i].clientDetails.mobile;
			//a.status = $scope.ifas1[i].clientDetails.status;
			$scope.clientVales.push(a);
			//console.log($scope.ifas[i].clientDetails.name);
		/*	$scope.values.push($scope.ifas[i].clientDetails.name);*/
		//console.log($scope.values);

		}
		$scope.showClients = true;
		$scope.showIfa = false;
		}
		
		/*console.log($scope.values);*/

    });

	}
/*	$scope.saveMe = function(i, str) {
		console.log($scope.values[i].uniqueId);
		console.log(str);
		var myData  = {
			uniqueId : $scope.values[i].uniqueId,
			modifyStr : str
		}
		$http.post('/v1/dashboard/updateIfa', myData).then(function (resp) {
			
			

		});
	}*/

	var myData = {
		ifaUniqueId : 'f38e8925e360a35a000180f8537a3260d23356c535236aa3411cb3211a930e48c4e908180c557fc7482cf78baceaf1cd014WEM8bsppqB2ClkxiSkE/HjChjhLlUaNBLd26caYPyjz+QezA9P4bOtiP/t9vW'
	}
	$http.post('/v1/sites/siteList').then(function (resp) {
		//$scope.values = resp.data.data;
		$scope.ifas = resp.data.data.siteList;

		for (var i = 0; i < $scope.ifas.length; i++) {
		var a = {};
		a.name = $scope.ifas[i].name;
		a.link = $scope.ifas[i].link;
		a.img_link = $scope.ifas[i].img_link;
		a.status = $scope.ifas[i].status;
		a.key = $scope.ifas[i].key;
		a.back_color = $scope.ifas[i].back_color;
		
		console.log(a.name);
		$scope.values.push(a);
			//console.log($scope.ifas[i].clientDetails.name);
		/*	$scope.values.push($scope.ifas[i].clientDetails.name);*/
		//console.log($scope.values);

		}
		$scope.showme = true;
		/*console.log($scope.values);*/

    });

}
