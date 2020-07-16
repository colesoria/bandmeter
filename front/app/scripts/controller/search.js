(function(){
	'use strict';

	var app = angular.module('Search',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('SearchCtrl',['$rootScope','$timeout','$cookies','$routeParams','$http','BaseUrl','$location', function($rootScope,$timeout,$cookies,$routeParams,$http,BaseUrl,$location){
		if(Session.id == 'undefined' || typeof(Session.id) == 'undefined'){
			$location.path('/');			
		}
		this.busqueda = $routeParams.what;
		this.fullnames = [];
		this.rooms = {};
		this.bands = {};

		var search = this;

		$http.get(BaseUrl+'users')
			 .success(function(data){
			 	if(data !== 'ko'){
				 	$timeout(function(){
				 		$rootScope.$apply(function(){
				 			$.each(data, function(index,value){
				 				if(value._id !== $cookies.user){
				 					search.fullnames.push(value);
				 				}
				 			});
				 		});
				 	});
				 }else{
				 	alert('El usuario no existe');
				 }
			 })
			 .error(function(err){
			 	alert(err);
			 });

		$http.get(BaseUrl+'jamrooms')
			 .success(function(data){
			 	if(data !== 'ko'){
				 	$timeout(function(){
				 		$rootScope.$apply(function(){
				 			search.rooms = data;
				 		});
				 	});
				 }else{
				 	alert('El usuario no existe');
				 }
			 })
			 .error(function(err){
			 	alert(err);
			 });
		$http.get(BaseUrl+'bands')
			 .success(function(data){
			 	if(data !== 'ko'){
				 	$timeout(function(){
				 		$rootScope.$apply(function(){
				 			search.bands = data;
				 		});
				 	});
				 }else{
				 	alert('El usuario no existe');
				 }
			 })
			 .error(function(err){
			 	alert(err);
			 });
	}]);
})();