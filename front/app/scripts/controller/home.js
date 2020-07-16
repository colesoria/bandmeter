(function(){
	'use strict';

	var app = angular.module('Home',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('HomeCtrl', function($rootScope,Session,$location,geolocation,$cookies,Socket,$timeout,$http,BaseUrl,SweetAlert){
		if(Session.id == 'undefined' || typeof(Session.id) == 'undefined'){
			$location.path('/');			
		}
		this.user = {};
		this.users = {};
		this.friends = [];
		var home = this;
		$rootScope.$broadcast('logado');

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
			$http.get(BaseUrl+'users')
				 .success(function(data){
			 		if(data !== 'ko'){
				 		$timeout(function(){
				 			$rootScope.$apply(function(){
				 				home.users = data;
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

        if(!$cookies.lat){
            geolocation.getLocation().then(function(data){
	            $cookies.lat = data.coords.latitude;
	            $cookies.long = data.coords.longitude;
	            home.coords = {lat:data.coords.latitude, long:data.coords.longitude};
	            home.user.id = $cookies.user;
	            home.user.nickname = $cookies.nickname;
	            var user = {coords: home.coords,nickname:$cookies.nickname,id:$cookies.user};
	            Socket.emit('newUserMap',user);
            });    
        }else{
            home.coords = {lat:$cookies.lat, long:$cookies.long};
            home.user.id = $cookies.user;
            home.user.nickname = $cookies.nickname;
            var user = {coords: home.coords,nickname:$cookies.nickname,id:$cookies.user};
            Socket.emit('newUserMap',user);
        }
        $http.get(BaseUrl+'users')
			 .success(function(data){
			 	if(data !== 'ko'){
				 	$timeout(function(){
				 		$rootScope.$apply(function(){
				 			home.users = data;
				 			$('#home').css('height',$(window).height()-70);
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
				 			home.user.id = data._id;
				 			$.each(data.friends,function(index, value){
				 				home.friends.push(value._id);
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
			 $timeout(function(){
				$rootScope.titulo = $rootScope.translation.header.home;
			 });
	});
})();