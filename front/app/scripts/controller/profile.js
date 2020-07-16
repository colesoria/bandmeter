(function(){
	'use strict';

	var app = angular.module('Profile',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('ProfileCtrl', ['$http','$rootScope','$routeParams','BaseUrl','$timeout','Session','$cookies','$upload','$location', function($http,$rootScope,$routeParams, BaseUrl,$timeout,Session,$cookies,$upload,$location){
		if(Session.id == 'undefined' || typeof(Session.id) == 'undefined'){
			$location.path('/');			
		}
		this.user = {};
		var profile = this;

		$http.get(BaseUrl+'profile/'+$routeParams.user)
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
  							if(typeof(data.city) == 'undefined'){
  								profile.user.city = 'City';
  							}
  							if(typeof(data.country) == 'undefined'){
  								profile.user.country = 'Country';
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
	}]);
})();