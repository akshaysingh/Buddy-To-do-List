var oroPartnersApp = angular.module('oroPartners',
	['ngRoute',
	'ngCookies',
    'oroPartnersController',
	]);

oroPartnersApp.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'index.html',
                    controller: 'indexCtrl'
                }).
                when('/topics', {
                	templateUrl : 'topics.html',
                	controller : 'topicsCtrl'
                })
                ;
        }]);

