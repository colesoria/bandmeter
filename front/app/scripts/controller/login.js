(function(){
  'use strict';

  var app = angular.module('Login',['services']);

  app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

  app.controller('LoginCtrl', function($timeout,$http,$routeParams,Session,Socket,geolocation,$location,$rootScope,BaseUrl,$cookies,SweetAlert){
	if(typeof(Session.id) == 'undefined'){
		$location.path('/');			
	}
    this.reg = {};
    var login = this;

	this.showLogin = function(){
		$('#menu_log').fadeOut('fast',function(){
			$('#signin').fadeIn('fast');
		});
	};

	this.showConcert = function(){
		$('#menu_log').fadeOut('fast',function(){
			$('#concert').fadeIn('fast');
		});
	};

	this.showReg = function(){
		$('#menu_log').fadeOut('fast',function(){
			$('#form').animate({
				height: '37%',
				top: '20%'
			},'fast');
			$('#register').fadeIn('fast');
		});
	};
	
	this.close = function(element){
		if(element === 'register'){
			$('#form').animate({
				height: '20%',
				top: '27%'
			},'fast');
		}
		$('#'+element).fadeOut('fast',function(){
			$('#menu_log').fadeIn('fast');
		});
	};

	var value = '';
	$('input').focus(function(){
		value = $(this).val();
		$(this).attr('value','');
		if($(this).attr('name') == 'password' || $(this).attr('name') == 'password2'){
			$(this).attr('type','password');
		}
	});

	$('input').blur(function(){
		if($(this).val()== ''){
			$(this).attr('value',value);
			if($(this).attr('name') == 'password' || $(this).attr('name') == 'password2'){
				$(this).attr('type','text');
			}	
		}
	});

	this.register = function(reg){
		var config = {username:reg.username,mail:reg.email,password:reg.password,fullname:reg.fullname};
		$http.post(BaseUrl+'user/register',config)
			 .success(function(data){
			 	login.reg = {};
			 	login.close('register');
			 	SweetAlert.swal("Thanks for registering","You have registered in Bandmeter.com, you'll receive an email to activate your account","success");
			 })
			 .error(function(error){
			 	alert(error);
			 });
	};

    this.login = function(signin){
    	var config = {email:signin.email,password:signin.password};
    	$http.post(BaseUrl+'user/login',config)
    		 .success(function(data){
    		 	if(data !== 'ko'){
    		 		Session.create(data._id,data._id,data);
    		 		$cookies.user = data._id;
    		 		$cookies.slug = data.slug;
    		 		$cookies.nickname = data.nickname;
					Socket.emit('logged',data);
			 		$location.path('/home');    		 		
    		 	}else{
    		 		SweetAlert.swal({
					  title: "Error!",
					  text: "User email or password is wrong!",
					  type: "error",
					  confirmButtonText: "Ok"
					});
    		 	}
    		 })
    		 .error(function(err){
    		 	SweetAlert.swal({
					  title: "Error!",
					  text: "User email or password is wrong!",
					  type: "error",
					  confirmButtonText: "Ok"
					});
    		 	$rootScope.$broadcast('logado');
    		 });
    };

   	var mapStyle = 
       	[{
		    "featureType": "water",
		    "elementType": "geometry",
		    "stylers": 
		    	[{
		            "color": "#74001b"
		        }]
		},
		{
		    "featureType": "landscape",
		    "elementType": "geometry",
		    "stylers": 
		    	[{
		            "color": "#b52127"
		        }]
		},
		{
		    "featureType": "poi",
		    "elementType": "geometry",
		    "stylers": 
		    	[{
				    "color": "#c5531b"
				}]
		},
		{
		    "featureType": "road.highway",
		    "elementType": "geometry.fill",
		    "stylers": 
		    	[{
				    "color": "#74001b"
				},
				{
				    "lightness": -10
				}]
	    },
	    {
	        "featureType": "road.highway",
	        "elementType": "geometry.stroke",
	        "stylers": 
	        	[{
				    "color": "#da3c3c"
				}]
	    },
	    {
	        "featureType": "road.arterial",
	        "elementType": "geometry.fill",
	        "stylers": 
	        	[{
				    "color": "#74001b"
				}]
	    },
	    {
	        "featureType": "road.arterial",
	        "elementType": "geometry.stroke",
	        "stylers": 
	        	[{
				    "color": "#da3c3c"
				}]
		},
	    {
	        "featureType": "road.local",
	        "elementType": "geometry.fill",
	        "stylers": 
	        	[{
	                "color": "#990c19"
	            }]
	    },
	    {
	        "elementType": "labels.text.fill",
	        "stylers": 
	        	[{
	                "color": "#ffffff"
	            }]
	    },
	    {
	        "elementType": "labels.text.stroke",
	        "stylers": 
	        	[{
	                "color": "#74001b"
	            },
	            {
	                "lightness": -8
	            }]
	    },
	    {
	        "featureType": "transit",
	        "elementType": "geometry",
	        "stylers": 
	        	[{
	                "color": "#6a0d10"
	            },
	            {
	                "visibility": "on"
	            }]
	    },
	    {
	        "featureType": "administrative",
	        "elementType": "geometry",
	        "stylers": 
	        	[{
		            "color": "#ffdfa6"
		        },
		        {
		            "weight": 0.4
		        }]
	    },
	    {
	        "featureType": "road.local",
	        "elementType": "geometry.stroke",
	        "stylers": 
	        	[{
				    "visibility": "off"
				}]
		}];

    function initialize(coords){
        var mapOptions = {
	        center: new google.maps.LatLng(coords.lat,coords.long),
    	    zoom: 3,
            disableDefaultUI: true,
            scrollwheel: true,
            styles: mapStyle
        };
        var markers = [];
        var infowindow = [];
        var contenido = [];
        var marker, i;
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        Socket.on('map',function(data){
            $timeout(function(){
                $rootScope.$apply(function(){
                    login.users = data;
                    if(markers !== []){
                        for (var i = 0, marker; marker = markers[i]; i++) {
                            marker.setMap(null);
                        }
                    }
                    for(i=0; i<data.length; i++) {
                        var myLatLng = new google.maps.LatLng(data[i].coords.lat, data[i].coords.long);
                        markers[i]=new google.maps.Marker({
                            position: myLatLng,
                            draggable:true,
                            clickable: true,
                            map: map,
                            animation: google.maps.Animation.DROP,
                            icon: 'http://bandmeter.com/img/marker-logo.png',
                            title: data[i].nickname,
                        });
                        (function(data,i){
	                        markers[i].addListener('click', function() {
			                    $http.get(BaseUrl+'user/'+data[i].id)
			                         .success(function(datos){
			                         	$location.path('/profile/'+datos.slug);
			                         });
								});                           	
                        })(data,i);
                    }
                });
            });
        });

        google.maps.event.addListener(map, 'bounds_changed', function() {
            var bounds = map.getBounds();
            //map.setZoom(6);
        });
    }
    geolocation.getLocation().then(function(data){
        login.coords = {lat:data.coords.latitude, long:data.coords.longitude};
        var user = {coords: login.coords};
        google.maps.event.addDomListener(window,'load',initialize(login.coords));
        Socket.emit('newUserMap',user);
    });
    $timeout(function(){
	    var leftPos = ($("#form").outerWidth() - $('#menu_log').outerWidth())/2;
    	$('#menu_log').css('left',leftPos);
    },500);
    $('#loginForm input').keyup(function(e){
    	if(e.keyCode == 13){
    		$('#signinbtn').trigger('click');
    	}
    });
    $('#register input').keyup(function(e){
    	if(e.keyCode == 13){
    		$('#regbtn').trigger('click');
    	}
    });
  });
})();