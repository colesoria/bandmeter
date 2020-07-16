(function(){
  'use strict';

  var app = angular.module('bandmeter', ['Application','BandsNew','FriendsWidget','UsersOnline','JCrop','MenuWeb','Activate','Bands', 'Studio', 'EditProfile','Footer','Friends','Home','JamRooms','Login','Messages','Notifications','Profile','ProfileLat','JamRoom','Search','ngRoute','services','ngCookies','angularFileUpload','directives','ngAnimate','oitozero.ngSweetAlert','geolocation']);

  app.config(['$locationProvider','$routeProvider',function($locationProvider,$routeProvider){
    $locationProvider.html5Mode( {
        enabled: true,
        requireBase: false
    });

    $routeProvider
      .when('/', {
        templateUrl: '/views/login.tpl.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/instrucctions', {
        templateUrl: '/views/instrucctions.tpl.html'
      })
      .when('/privacy-policy', {
        templateUrl: '/views/privacy.tpl.html'
      })
      .when('/cookies-policy', {
        templateUrl: '/views/cookies.tpl.html'
      })
      .when('/home', {
        templateUrl: '/views/home.tpl.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/room/:room', {
        templateUrl: '/views/room.tpl.html',
        controller: 'RoomCtrl',
        controllerAs: 'room'
      })
      .when('/activate/:token', {
        templateUrl: '/views/login.tpl.html',
        controller: 'ActivateCtrl',
        controllerAs: 'activate'
      })
      .when('/profile/:user', {
        templateUrl: '/views/profile.tpl.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      .when('/edit_profile/:user', {
        templateUrl: '/views/editprofile.tpl.html',
        controller: 'EditProfileCtrl',
        controllerAs: 'editprofile'
      })
      .when('/jamrooms', {
        templateUrl: '/views/jamrooms.tpl.html',
        controller: 'JamRoomsCtrl',
        controllerAs: 'jamrooms'
      })
      .when('/bands', {
        templateUrl: '/views/bands.tpl.html',
        controller: 'BandsCtrl',
        controllerAs: 'bands'
      })
      .when('/bands/new', {
        templateUrl: '/views/bandsnew.tpl.html',
        controller: 'BandsNewCtrl',
        controllerAs: 'bandsnew'
      })
      .when('/band/:slug', {
        templateUrl: '/views/bandprofile.tpl.html',
        controller: 'BandCtrl',
        controllerAs: 'band'
      })
      .when('/friends', {
        templateUrl: '/views/friends.tpl.html',
        controller: 'FriendsCtrl',
        controllerAs: 'friends'
      })
      .when('/messages', {
        templateUrl: '/views/messages.tpl.html',
        controller: 'MessagesCtrl',
        controllerAs: 'messages'
      })
      .when('/notifications', {
        templateUrl: '/views/notifications.tpl.html',
        controller: 'NotificationsCtrl',
        controllerAs: 'notifications'
      })
      .when('/studio', {
        templateUrl: '/views/studio.tpl.html',
        controller: 'StudioCtrl'
        //controllerAs: 'studio'
      })
      .when('/search/:what', {
        templateUrl: '/views/search.tpl.html',
        controller: 'SearchCtrl',
        controllerAs: 'search'
      })
      .otherwise({ redirectTo: '/' });
  }]);
  
  app.run(function($window){
    $(document).ready(function(){
      $.cookiesDirective({
        privacyPolicyUri: '/privacy'
      });
    });
  });
})();
