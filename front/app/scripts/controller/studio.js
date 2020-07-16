(function(){
	'use strict';

	var app = angular.module('Studio',['services','angularAudioRecorder']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('StudioCtrl', function($rootScope,$scope, $timeout,$cookies,$location){
		if(Session.id == 'undefined' || typeof(Session.id) == 'undefined'){
			$location.path('/');			
		}
		$scope.timeLimit = 10;
	});

	app.config(function (recorderServiceProvider) {
	    recorderServiceProvider
	      .forceSwf(false)
	      //.setSwfUrl('/lib/recorder.swf')
	      .withMp3Conversion(true)
	    ;
	});
})();