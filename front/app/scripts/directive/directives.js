(function(){
    'use strict';
	var app = angular.module('directives', []);

	app.directive('bandheader', function(){
		return {
			restrict: 'E',
			templateUrl: '/views/parts/header.tpl.html',
			controller: 'ProfileWebController',
			controllerAs: 'profileweb'
		};
	});

	app.directive('usersonline', function(){
		return {
			restrict: 'E',
			templateUrl: '/views/parts/usersonline.tpl.html',
			controller: 'UsersOlineController',
			controllerAs: 'usersonline'
		};
	});

	app.directive('friendswidget', function(){
		return {
			restrict: 'E',
			templateUrl: '/views/parts/friendswidget.tpl.html',
			controller: 'FriendsWidetController',
			controllerAs: 'friendswidget'
		};
	});

	app.directive('widgetright', function(){
		return {
			templateUrl: '/views/parts/widgetright.tpl.html'
		};
	});

	app.directive('bandfooter', function(){
		return {
			restrict: 'E',
			templateUrl: '/views/parts/footer.tpl.html',
			controller: 'BandFooterController',
			controllerAs: 'bandfooter'
		};
	});

	app.directive('profileweb', function(){
		return {
			restrict: 'E',
			templateUrl: '/views/parts/profileweb.tpl.html',
			controller: 'ProfileWebController',
			controllerAs: 'profileweb'
		};
	});

	app.directive('menuweb', function(){
		return {
			restrict: 'E',
			templateUrl: '/views/parts/menuweb.tpl.html',
			controller: 'MenuWebController',
			controllerAs: 'menuweb'
		};
	});

})();