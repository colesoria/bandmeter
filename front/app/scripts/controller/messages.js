(function(){
	'use strict';

	var app = angular.module('Messages',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('MessagesCtrl', function($rootScope,$timeout,$cookies,$http,BaseUrl, Session, $location){
		if(Session.id == 'undefined' || typeof(Session.id) == 'undefined'){
			$location.path('/');			
		}
		this.messages = [];

		var mess = this;
		this.searchMessages = function(){
			$http.get(BaseUrl+'notifications/'+$cookies.user)
				 .success(function(data){
					 if(data !== 'ko'){
						 $timeout(function(){
						 	$rootScope.$apply(function(){
						 		var i = 0;
						 		$.each(data, function(index,value){
						 			$http.get(BaseUrl+'user/'+value.sender)
						 				 .success(function(userdata){
						 				 	mess.messages[i] = {};
						 					mess.messages[i]._id = value._id;
						 					mess.messages[i].message = value.message;
						 				 	mess.messages[i].sender = userdata.nickname;
						 				 	mess.messages[i].senderId = value.sender;
						 				 	mess.messages[i].senderImg = userdata.image;
						 				 	mess.messages[i].fecha = value.createdAt;
						 				 	mess.messages[i].slug = userdata.slug;
						 				 	mess.messages[i].isread = value.read;
						 				 	i++;
						 				 });
						 			$http.put(BaseUrl+'notification/'+value._id)
						 				 .success(function(){
						 				 	console.log('Ha actualizado el mensaje '+vaule._id);
						 				 });
						 			});
						 		});
						 		$rootScope.$broadcast('resetMessages');
						 	});
						 }else{
						 	alert('El usuario no existe');
						 }
					 })
					 .error(function(err){
					 	alert(err);
					 });
		};

		this.acceptFriend = function(id){
			
		};

		$rootScope.$on('messageReceived',function(){
			mess.searchMessages();
		});
		mess.searchMessages();
		$rootScope.titulo = $rootScope.translation.header.messages;
	});
})();