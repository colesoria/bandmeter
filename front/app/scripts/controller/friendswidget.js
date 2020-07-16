(function(){
	'use strict';

	var app = angular.module('FriendsWidget',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('FriendsWidetController', function($rootScope,Session,$location,geolocation,$cookies,Socket,$timeout,$http,BaseUrl,SweetAlert){
		this.users = {};
		this.user = {};
		this.friends = [];
		var friends = this;

		Socket.on('loggedUser', function(data){
	        $http.get(BaseUrl+'user/'+$cookies.user)
				 .success(function(data){
				 	if(data !== 'ko'){
					 	$timeout(function(){
					 		$rootScope.$apply(function(){
					 			friends.user.id = data._id;
					 			$.each(data.friends,function(index, value){
					 				friends.friends.push(value._id);
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
		});

        $http.get(BaseUrl+'user/'+$cookies.user)
			 .success(function(data){
			 	if(data !== 'ko'){
				 	$timeout(function(){
				 		$rootScope.$apply(function(){
				 			friends.user.id = data._id;
				 			$.each(data.friends,function(index, value){
				 				$http.get(BaseUrl+'user/'+value._id)
				 					 .success(function(data){
				 					 	$timeout(function(){
				 					 		$rootScope.$apply(function(){
				 					 			friends.friends.push(data);
				 					 		});
				 					 	});
				 					 });
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
	});
})();