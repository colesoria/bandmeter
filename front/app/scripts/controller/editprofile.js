(function(){
	'use strict';

	var app = angular.module('EditProfile',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

	app.controller('EditProfileCtrl', function($http,$rootScope,$routeParams, BaseUrl,$timeout,Session,$cookies,$upload,$location,SweetAlert){
		if(Session.id == 'undefined' || typeof(Session.id) == 'undefined'){
			$location.path('/');			
		}
		this.user = {};
		this.edit = false;
		this.nickname = false;
		this.fullname = false;
		this.city = false;
		this.country = false;
		var profile = this;
		if($routeParams.user !== $cookies.slug){
			$location.path('/');
		}
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

		this.onFileSelect = function($files,que){
            var upload = $files[0];
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                if(que == 'bgimg'){
					$rootScope.upload = $upload.upload({
	                    url: BaseUrl+'uploadimg', //upload.php script, node.js route, or servlet url
	                    //method: 'POST' or 'PUT',
	                    //headers: {'header-key': 'header-value'},
	                    //withCredentials: true,
	                    data: {myObj: $rootScope.myModelObj},
	                    file: file, // or list of files ($files) for html5 only
	                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
	                    // customize file formData name ('Content-Disposition'), server side file variable name. 
	                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
	                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
	                    //formDataAppender: function(formData, key, val){}
	                }).progress(function(evt) {
	                	profile.dbimgloading = true;
	                    //profile.coverimage = parseInt(100.0 * evt.loaded / evt.total);
	                }).success(function(data, status, headers, config) {
	                    if(data == 'ko'){
	                        var message = 'tipo de fichero erroneo';
	                        $rootScope.$broadcast('showMessage',{message:message});
	                        return;
	                    }
	                    // file is uploaded successfully
	                    $timeout(function(){
	                        $rootScope.$apply(function(){
	                        	profile.dbimgloading = false;
	                        	//$rootScope.$broadcast('jcrop', data);
	                        	var config = profile.user;
	                        	config.backgroundImage = data;
	                        	$http.post(BaseUrl+'user/'+$cookies.user, config)
	                        		 .success(function(data){
	                        		 	profile.user = data;
	                        		 });
	                            //profile.user.bgimage = '/uploads/'+data;
	                        });
	                    });
	                })
	                .error(function(error){
	                    var message = error;
	                    $rootScope.$broadcast('showMessage',{message:message});
	                });
                }
				if(que == 'profimg'){
					$rootScope.upload = $upload.upload({
	                    url: BaseUrl+'uploadimg', //upload.php script, node.js route, or servlet url
	                    //method: 'POST' or 'PUT',
	                    //headers: {'header-key': 'header-value'},
	                    //withCredentials: true,
	                    data: {myObj: $rootScope.myModelObj},
	                    file: file, // or list of files ($files) for html5 only
	                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
	                    // customize file formData name ('Content-Disposition'), server side file variable name. 
	                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
	                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
	                    //formDataAppender: function(formData, key, val){}
	                }).progress(function(evt) {
	                	profile.dprogimgloading = true;
	                }).success(function(data, status, headers, config) {
	                    if(data == 'ko'){
	                        var message = 'tipo de fichero erroneo';
	                        $rootScope.$broadcast('showMessage',{message:message});
	                        return;
	                    }
	                    // file is uploaded successfully
	                    $timeout(function(){
	                        $rootScope.$apply(function(){
	                        	profile.dprogimgloading = false;
	                        	var config = profile.user;
	                        	config.image = data;
	                        	$http.post(BaseUrl+'user/'+$cookies.user, config)
	                        		 .success(function(data){
	                        		 	profile.user = data;
	                        		 });
	                        });
	                    });
	                })
	                .error(function(error){
	                    var message = error;
	                    $rootScope.$broadcast('showMessage',{message:message});
	                });
                }
            }
        };

        this.update = function(prop){
   			profile.user.nickname = $('input[name="nickname"]').val();
   			profile.user.fullname = $('input[name="fullname"]').val();
   			profile.user.city = $('input[name="city"]').val();        			
   			profile.user.country = $('input[name="country"]').val();
   			profile.user.instruments = $('input[name="instruments"]').val();        			

        	var config = profile.user;
	        $http.post(BaseUrl+'user/'+$cookies.user, config)
	             .success(function(data){
	                profile.user = data;
	               	$rootScope.$broadcast('updatedUser');
	               	SweetAlert.swal("Felicidades!", "Has actualizado tu perfil",'success');
	             });
        };

        if($('.profimg').width() > $('.profimg').height()){
        	$('.profimg').css({width: 'auto',height: "100%"});
        }
	});
})();