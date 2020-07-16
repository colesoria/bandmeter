(function(){
  'use strict';

  var app = angular.module('Application',['services']);

  app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

  app.controller('ApplicationController', function($rootScope,$location,Session,$http,BaseUrl,$timeout,$cookies,SweetAlert,Socket,facebookService){
  	var fbdata = facebookService.getMyData();
    console.log(fbdata);
    $rootScope.$on('logado', function(){
  		app.logado = true;
  		if(Session.user == 'undefined' && typeof(Session.user.image) == 'undefined'){
  			app.user.image = 'defaultuser.jpg';
  		}
  	});
  	$rootScope.$on('deslogado', function(){
  		app.logado = false;
  	});
  	$rootScope.$on('inroom', function(){
  		app.room = true;
  	});
  	$rootScope.$on('outroom', function(){
  		app.room = false;
  	});
    if(!$cookies.languaje){
      if(navigator.language.split('-')[0] !== 'es'){
        $cookies.languaje = "en"
      }else{
        $cookies.languaje = navigator.language.split('-')[0];        
      }
    }
    this.language = $cookies.languaje;
    this.translation = {};
    this.logado = false;
    this.room = false;
    this.jamroom = {};
    this.user = {};
    $rootScope.titulo = '';
    this.createJamroom = false;
    var app = this;
    $http.get('/lang/'+this.language+'.json')
        .success(function(data){
          app.translation = data;
          $rootScope.translation = data;
        });


    this.acceptFriend = function(id, messageId){
      var config = {friend: id};
      $http.post(BaseUrl+'friend/'+Session.id,config)
           .success(function(data){
              app.user = data;
              $http.delete(BaseUrl+'notification/'+messageId)
                   .success(function(){
                      $('#'+messageId).remove();
                      SweetAlert.swal("Friendship Accepted","You've accepted this friendship.","success");
                   });
           })
           .error(function(err){
            alert(err);
           });
    };

    this.showMenu = function(){
      if($('menuweb').hasClass('desplegado')){
        $('menuweb').removeClass('desplegado');
        $('menuweb').animate({"left":"-180px"});
      }else{
        $('menuweb').addClass('desplegado');
        $('menuweb').animate({"left":"0px"});
      }
    };

    this.showLang = function(){
      $('#langmen').slideToggle();
    };

    this.changeLang = function(lang){
      $cookies.languaje = lang;
      app.language = lang;
      $http.get('/lang/'+app.language+'.json')
        .success(function(data){
          app.translation = data;
          $('#langmen').slideToggle();
        });
    };

  	this.logout = function(){
  		if($cookies.user !== 'false'){
	  		var config = {userid: $cookies.user};
	  		$http.post(BaseUrl+'user/logout', config)
	  			 .success(function(data){
	  			 	Session.destroy();
	  			 	$timeout(function(){
	  			 		$rootScope.$apply(function(){
	  			 			app.logado = false;{}
	  			 			app.user = {};
	  			 			$cookies.user = false;
	  			 			$cookies.nickname = false;
	  			 			$cookies.slug = false;
	  			 			$rootScope.$broadcast('deslogado');
	  			 			$location.path('/');
	  			 		});
	  			 	})
	  			 })
	  			 .error(function(err){
	  			 	alert(err);
	  			 });
  		}
  	};

  	this.search = function(search){
  		$location.path('/search/'+search);
  	};

  	this.sendMessage = function(nickname, id){
		  SweetAlert.swal({
  				title: app.translation.message.sendMessage,
   				type: "input",
  				showCancelButton: true,
  				closeOnConfirm: false,
  				animation: "slide-from-top",
  				inputPlaceholder: app.translation.message.inputTextMessage+nickname
			},
			function(inputValue){
  				if (inputValue === false) return false;
  
  				if (inputValue === "") {
    				swal.showInputError("Necesitas escribir algo.");
    			return false
  			}
  			var config = {message: inputValue, sender: $cookies.user, receiver: id, notificationtype: 'message'};
	   		$http.post(BaseUrl+'notifications', config)
	   			   .success(function(data){
	   			 	   Socket.emit('message',id);
					     SweetAlert.swal("Mensaje enviado","Tu mensaje ha sido enviado al usuario "+nickname+".","success");
	   		    });
		  });
  	};

  	this.deleteMessage = function(id){
  		swal({
  			title: "¿Estás seguro?",
  			text: "¡No podrás recuperar el mensaje una vez eliminado!",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "¡Sí! bórralo",
			  closeOnConfirm: false
		  },
		  function(){
			  $http.delete(BaseUrl+'notification/'+id)
				     .success(function(){
				 	      $('#'+id).remove();
		  			     swal("¡Borrado!", "Has borrado el mensaje.", "success");
				     });
		    });
  	};
  	if($cookies.user !== false){
  		var config = {userid: $cookies.user};
  		$http.post(BaseUrl+'islogged', config)
			 .success(function(data){
        console.log(data);
	  		 	if(data == 'ko'){
	  		 		//app.logout();
	  		 		$location.path('/');
	  		 	}else{
	  		 		Session.create(data._id,data._id,data);
	  		 		app.logado = true;
					  app.user = Session.user;
			  		if(typeof(Session.user.image) == 'undefined'){
			  			app.user.image = 'defaultuser.gif';
			  		}
			  		if($location.path() === '/'){
			  			$location.path('/home');
			  		}
			  		$rootScope.$broadcast('logado');
	  		 	}
			 })
			 .error(function(err){
  		 		alert(err);
			 });
  	}
  });
})();