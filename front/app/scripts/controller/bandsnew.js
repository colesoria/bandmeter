(function(){
	'use strict';

	var app = angular.module('BandsNew',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('BandsNewCtrl',function($rootScope,$timeout,$cookies,Socket,$location){
		/*if(!$cookies.user){
			$location.path('/');
		}*/
		this.band = {};
		var band = this;
		band.band.logo = 'defaultimg.png';
		band.band.imageBand = 'defaultimg.png';
	});
})();