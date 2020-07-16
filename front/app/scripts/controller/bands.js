(function(){
	'use strict';

	var app = angular.module('Bands',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('BandsCtrl',function($rootScope,$timeout,$cookies,Socket,$location,$http,BaseUrl){
		if(!$cookies.user){
			$location.path('/');
		}
		this.bands = {};
		var bands = this;
		$http.get(BaseUrl+'bands')
		     .success(function(data){
		     	$timeout(function(){
		     		$rootScope.$apply(function(){
		     			bands.bands = data;
		     			$.each(bands.bands,function(index, value){
		     					$.each(value.members, function(index2, value2){
					 				$.get(BaseUrl+'user/'+value2.id)
						 				 .success(function(data){
						 				 	$timeout(function(){
				     							$rootScope.$apply(function(){
						 				 			bands.bands[index].userMember = data;
						 				 		});
				     						});
						 				 });
		     					});
				 		});
		     		});
		     	});
		     })
		     .error(function(error){
		     	alert("Ha habido un error");
		     	console.log(error);
		     });

		this.createBand = function(){
			$location.path('/bands/new');
		}
		Socket.on('newBand', function(){
			$http.get(BaseUrl+'bands')
		     .success(function(data){
		     	alert("He conseguido las bandas o no");
		     	console.log(data);
		     	$timeout(function(){
		     		$rootScope.$apply(function(){
		     			bands.bands = data;
		     			$.each(bands.bands,function(index, value){
		     					$.each(value.members, function(index2, value2){
					 				$.get(BaseUrl+'user/'+value2.id)
						 				 .success(function(data){
						 				 	$timeout(function(){
				     							$rootScope.$apply(function(){
						 				 			bands.bands[index].userMember = data;
						 				 		});
				     						});
						 				 });
		     					});
				 		});
		     		});
		     	});
		     })
		     .error(function(error){
		     	alert("Ha habido un error");
		     	console.log(error);
		     });
		});

	});
})();