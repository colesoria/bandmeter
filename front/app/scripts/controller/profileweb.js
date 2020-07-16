(function(){
	'use strict';

	var app = angular.module('ProfileLat',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('ProfileWebController', function($http,$rootScope,$routeParams, BaseUrl,$timeout,Session,$cookies,$upload,$location){
		this.user = {};
		var profile = this;
		$http.get(BaseUrl+'profile/'+$cookies.slug)
			 .success(function(data){
			 	if(data !== 'ko'){
				 	$timeout(function(){
				 		$rootScope.$apply(function(){
				 			profile.user = data;
				 			if(!profile.user.image){
  								profile.user.image = 'defaultuser.gif';
  							}
  							if(!profile.user.backgroundImage){
  								profile.user.backgroundImage = 'defaultimg.png';
  							}
				 		});
				 	});
				 }else{
				 	alert('El usuario no existe');
				 }
			 })
			 .error(function(err){
			 	alert(err);
			 });
		$rootScope.$on('updatedUser', function(){
			$http.get(BaseUrl+'profile/'+$cookies.slug)
				 .success(function(data){
			 		if(data !== 'ko'){
					 	$timeout(function(){
					 		$rootScope.$apply(function(){
					 			profile.user = data;
					 			if(typeof(data.image) == 'undefined'){
  									profile.user.image = 'defaultuser.gif';
  								}
  								if(typeof(data.backgroundImage) == 'undefined'){
  									profile.user.backgroundImage = 'defaultimg.png';
  								}
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
	});
})();