(function(){
	'use strict';

	var app = angular.module('Friends',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('FriendsCtrl',['$rootScope','$timeout','$cookies', function($rootScope,$timeout,$cookies){
		/*if(!$cookies.user){
			$location.path('/');
		}*/
	}]);

})();