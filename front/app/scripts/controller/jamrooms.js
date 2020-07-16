(function(){
	'use strict';

	var app = angular.module('JamRooms',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('JamRoomsCtrl',function($rootScope,$timeout,SweetAlert,$cookies,$location,$http,BaseUrl,Socket){
		if(!$cookies.user){
			$location.path('/');
		}
		this.jamrooms = {};
		this.ismember = false;
		var jamroom = this;

		$http.get(BaseUrl+'jamrooms')
		     .success(function(data){
		     	$timeout(function(){
		     		$rootScope.$apply(function(){
		     			jamroom.jamrooms = data;
		     			$.each(jamroom.jamrooms,function(index, value){
				 				$.get(BaseUrl+'user/'+value.owner)
				 				 .success(function(data){
				 				 	if(value.owner == $cookies.user || value.members.indexOf({id:$cookies.user}) > 1){
		     							jamroom.ismember = true;
		     						}
				 				 	$timeout(function(){
		     							$rootScope.$apply(function(){
				 				 			jamroom.jamrooms[index].userOwner = data;
				 				 		});
		     						});
				 				 });
				 				 $.each(value.members,function(index2,value2){
				 				 		$.get(BaseUrl+'user/'+value2)
				 				 		 .success(function(data){
				 				 				$timeout(function(){
		     										$rootScope.$apply(function(){
				 				 						jamroom.jamrooms[index].userMember[index2] = data;
				 				 				});
		     								});
				 				 		});
				 				 });
				 		});
		     		});
		     	});
		     });

		Socket.on('newJamroom', function(){
			$http.get(BseUrl+'jamrooms')
			     .success(function(data){
			     	$timeout(function(){
			     		$rootScope.$apply(function(){
			     			jamroom.jamrooms = data;
			     		});
			     	});
			     });
		});

		this.accessJamroom = function(room){
			$location.path('/room/'+room);
		};

		this.createJamroom = function(){
			SweetAlert.swal({
	  				title: "Create a new JamRoom",
	  				//text: "Write something interesting:",
	  				type: "input",
	  				showCancelButton: true,
	  				closeOnConfirm: false,
	  				animation: "slide-from-top",
	  				inputPlaceholder: "Write the name of the JamRoom"
				},
				function(inputValue){
	  				if (inputValue === false) return false;
	  
	  				if (inputValue === "") {
	    				swal.showInputError("You need to write something!");
	    			return false
	  			}
	  			var config = {name: inputValue, owner: $cookies.user};
		   		$http.post(BaseUrl+'jamrooms', config)
		   			 .success(function(data){
		   			 	app.jamroom = data;
		   			 	SweetAlert.swal("Felicidades!", "Has creado la JamRoom " + inputValue,'success');
		   			 	Socket.emit('newJamroom',data);
		   			 	$location.path('/room/'+data.slug);
		   			 });
			});
		};
		this.joinJamroom = function(code, user){
	    	var config = {code: code, user: $cookies.user};
			$http.post(BaseUrl+'joinjamroom', config)
				 .success(function(data){
				 	app.jamroom = data;
				 	$location.path('/room/'+data.slug);
			    });
	    };

		$timeout(function(){
			$rootScope.titulo = 'jamrooms';
		});
	});
})();