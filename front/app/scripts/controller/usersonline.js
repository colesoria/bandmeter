(function(){
	'use strict';

	var app = angular.module('UsersOnline',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('UsersOlineController', function($rootScope,Session,$location,geolocation,$cookies,Socket,$timeout,$http,BaseUrl,SweetAlert){
		this.users = {};
		this.user = {};
		this.friends = [];
		var usersonline = this;

		this.askForFriend = function(id){
			var message = "Wants to be your friend. Do you accept this friendship?";
			var config = {sender:home.user.id,receiver:id,message:message,notificationtype:'askForFriendship'};
			$http.post(BaseUrl+'notifications',config)
				 .success(function(data){
				 	SweetAlert.swal("Congratulations","Your request has been sent","success");
				 })
				 .error(function(error){
				 	alert(error);
				 });
		};

		Socket.on('loggedUser', function(data){
			$http.get(BaseUrl+'usersonline')
				 .success(function(data){
			 		if(data !== 'ko'){
				 		$timeout(function(){
				 			$rootScope.$apply(function(){
				 				usersonline.users = data;
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

        $http.get(BaseUrl+'usersonline')
			 .success(function(data){
			 	if(data !== 'ko'){
				 	$timeout(function(){
				 		$rootScope.$apply(function(){
				 			usersonline.users = data;
				 		});
				 	});
				 }else{
				 	alert('El usuario no existe');
				 }
			 })
			 .error(function(err){
			 	alert(err);
			 });

        $http.get(BaseUrl+'user/'+$cookies.user)
			 .success(function(data){
			 	if(data !== 'ko'){
				 	$timeout(function(){
				 		$rootScope.$apply(function(){
				 			usersonline.user.id = data._id;
				 			$.each(data.friends,function(index, value){
				 				usersonline.friends.push(value._id);
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