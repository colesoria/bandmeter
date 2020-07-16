(function(){
	'use strict';

	var app = angular.module('JCrop',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('JcropController',['$rootScope','$timeout', function($rootScope,$timeout){
		this.image = '';
		var jcrop = this;

		this.showPreview = function(coords){
			var rx = 100 / coords.w;
			var ry = 100 / coords.h;

			$('#preview').css({
				width: Math.round(rx * 500) + 'px',
				height: Math.round(ry * 370) + 'px',
				marginLeft: '-' + Math.round(rx * coords.x) + 'px',
				marginTop: '-' + Math.round(ry * coords.y) + 'px'
			});
		}
		$rootScope.$on('jcrop', function(event,data){
			jcrop.image = '/uploads/'+data;
			$timeout(function(){
				$('#target').Jcrop({
					onChange: jcrop.showPreview,
					onSelect: jcrop.showPreview,
					aspectRatio: 1
				});
			},3000);
		});

	}]);
})();