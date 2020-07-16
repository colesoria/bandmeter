(function(){
	'use strict';

	var app = angular.module('MenuWeb',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('MenuWebController',['$rootScope','$timeout','Socket','$cookies','$http','BaseUrl','$location', function($rootScope,$timeout,Socket,$cookies,$http,BaseUrl,$location){
		this.messages = 0;

		var menuweb = this;
		$rootScope.$on('logado', function(){
			$http.get(BaseUrl+'notifications/'+$cookies.user)
				 .success(function(data){
					 if(data !== 'ko'){
					 	$timeout(function(){
					 		$rootScope.$apply(function(){
					 			menuweb.messages = 0;
					 			$.each(data,function(index,value){
					 				if(value.read === false){
					 					menuweb.messages++;
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

			Socket.on($cookies.user, function(){
				console.log('He recibido un mensaje desde Socket');
				$rootScope.$broadcast('messageReceived');
			});
		});

		$rootScope.$on('messageReceived', function(){
			console.log("He recibido un mensaje");
			menuweb.messages = menuweb.messages+1;
		});
		$rootScope.$on('resetMessages', function(){
			console.log("Está leyendo los mensajes");
			menuweb.messages = 0;
		});
	}]);
})();