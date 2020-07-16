(function(){
	'use strict';

	var app = angular.module('Notifications',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('NotificationsCtrl',['$rootScope','$timeout','Session', function($rootScope,$timeout,Session){
		if(Session.id == 'undefined' || typeof(Session.id) == 'undefined'){
			$location.path('/');			
		}
	}]);
})();