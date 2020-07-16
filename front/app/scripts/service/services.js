(function(){
  'use strict';

  var app = angular.module('services',['ngResource']);

  app.service('Login', function($resource, BaseUrl){
    return $resource(BaseUrl+'/user/login',{email:'@_email', password:'@_password'});
  });

  app.service('Users', function($resource, BaseUrl){
    return $resource(BaseUrl+'/users');
  });

  app.service('UserId', function($resource, BaseUrl){
    return $resource(BaseUrl+'/user/:id',{id: '@_id'});
  });

  app.service('UserSlug', function($resource, BaseUrl){
    return $resource(BaseUrl+'/user/:slug',{slug:'@_slug'});
  });

  app.service('Session', function(){
    this.create = function(sessionId, userId, user){
      this.id = sessionId;
      this.userId = userId;
      this.user = user;
    };
    this.destroy = function(){
      this.id = null;
      this.userId = null;
      this.user = null;
    };
    return this;
  });
  app.service('Socket', function(){
    return io.connect('http://bandmeter.com:3030');
  });

  app.factory('facebookService', function($q) {
    return {
        getMyData: function() {
            var deferred = $q.defer();
            FB.api('/me', function(response) {
              console.log(response.error);
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
});
  app.constant('BaseUrl', 'http://bandmeter.com:3000/api');
})();
