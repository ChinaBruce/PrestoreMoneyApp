// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var remoteUrl = "http://121.28.95.78:93/api/";//"http://121.28.95.78:93/api/";  192.168.51.52:45429
var signatureKey = "prestoremoney.common.2016";
var token = "";
var UUID = "";

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])
  .run(['$ionicPlatform', '$rootScope', '$cordovaAppVersion', '$ionicPopup', '$location', '$ionicHistory', '$cordovaToast', function ($ionicPlatform, $rootScope, $cordovaAppVersion, $ionicPopup, $location, $ionicHistory, $cordovaToast) {
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

    });

    //双击退出  
    $ionicPlatform.registerBackButtonAction(function (e) {
      //判断处于哪个页面时双击退出  
      if ($location.path() == '/app/record' || $location.path() == '/app/search') {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.showShortTop('再按一次退出系统');
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      }
      else if ($location.path() == '/login') {
        ionic.Platform.exitApp();
      }
      else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.showShortTop('再按一次退出系统');
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      }
      e.preventDefault();
      return false;
    }, 101);
  }])

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'appCtrl',
      cache: false
    })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl',
        cache: false
      })
      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        },
        cache: false
      })

      .state('app.record', {
        url: '/record',
        views: {
          'menuContent': {
            templateUrl: 'templates/record.html'
          }
        },
        cache: false
      })

    if (window.localStorage.getItem("token") != null) {
      token = window.localStorage.getItem("token");
      $urlRouterProvider.otherwise('/app/record');
    }
    else {
      $urlRouterProvider.otherwise('/login');
    }
  });