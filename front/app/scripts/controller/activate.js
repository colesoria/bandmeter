(function(){
	'use strict';

	var app = angular.module('Activate',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('ActivateCtrl', function($http,$rootScope,$routeParams,Session,$location){
		var ancho = $(window).width();
    	var alto = $(window).height()-$('.footerMenu').height();
	    var fontSize = ancho* 0.013;
	    var fontSizeMen = ancho* 0.011;
	    $('#wrap').css('width','100%').css('height','100vh').css('overflow','hidden');
	    var anchoCaja = $('#form').innerWidth();
	    var altoCaja = $('#form').height();
	    $('#menu_log li').css('font-size',fontSize+'px');
	    $('#menu_log').css('margin-top',(altoCaja-$('#menu_log').height())/2);
	    $('#menu_log').css('margin-left',(anchoCaja-$('#menu_log').width())/2);
	    $('.menuWeb li').css('font-size',fontSizeMen);
	    $('input').css('font-size',fontSizeMen);
	    $('span').css('font-size',fontSizeMen);
	    $('.button').css('font-size',fontSize);
		var token = $routeParams.token;
		$http.post('http://bandmeter.com:3000/api/activate/'+token)
			 .success(function(data){
			 	if(data !== 'ko'){
    		 		$cookies.user = data._id;
    		 		$cookies.slug = data.slug;
    		 		$cookies.nickname = data.nickname;
				 	Session.create(data._id,data._id,data);
				 	$location.path('/home');
				 }else{
				 	alert('el token no es válido');
				 	$location.path('/');
				 }
			 })
			 .error(function(err){
			 	console.log(err);
			 });
	});
})();