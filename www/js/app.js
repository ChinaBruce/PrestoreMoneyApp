// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var remoteUrl = "http://192.168.57.180:45429/api/";//"http://121.28.95.78:93/api/";
var signatureKey = "prestoremoney.common.2016";
var token = "";
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])
  .run(['$ionicPlatform','$rootScope','$cordovaAppVersion',function ($ionicPlatform, $rootScope, $cordovaAppVersion) {
    $ionicPlatform.ready(function ($rootScope) {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      
      function GetAppVersion() {
        $cordovaAppVersion.getVersionNumber().then(function (data) {
          $rootScope.version = data;
        });
      }
    });
  }])

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'appCtrl'
    })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })
      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })

      .state('app.record', {
        url: '/record',
        views: {
          'menuContent': {
            templateUrl: 'templates/record.html'
          }
        }
      })
    $urlRouterProvider.otherwise('/login');
  });

