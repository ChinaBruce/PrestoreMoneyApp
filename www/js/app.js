// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var remoteUrl = "http://121.28.95.78:93/api/";//"http://121.28.95.78:93/api/";  192.168.51.52:45429
var signatureKey = "prestoremoney.common.2016";
var token = "";
var UUID = "";
var apptype = 0;
var loginUser = null;
var currentPAInfo = null;//当前查询到的预储金账户信息

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])
  .run(['$ionicPlatform', '$rootScope', '$cordovaAppVersion', '$ionicPopup', '$location', '$ionicHistory', '$cordovaToast', "$cordovaDevice", function ($ionicPlatform, $rootScope, $cordovaAppVersion, $ionicPopup, $location, $ionicHistory, $cordovaToast, $cordovaDevice) {
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

      if ($cordovaDevice.getPlatform() == "Android") {
        apptype = 2;
      }
      else if ($cordovaDevice.getPlatform() == "iOS") {
        apptype = 1;
      }
    });

    //双击退出  
    $ionicPlatform.registerBackButtonAction(function (e) {
      //判断处于哪个页面时双击退出  
      if ($location.path() == '/app/home') {
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
      controller: 'menuCtrl'
    })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: "loginCtrl",
        cache: false
      })
      .state('app.search', {
        url: '/search',
        params:{'backUrl': ""},
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: "searchCtrl"
          }
        }
      })

      .state('app.record', {
        url: '/record',
        views: {
          'menuContent': {
            templateUrl: 'templates/record.html',
            controller: "recordCtrl"
          }
        }
      })
      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            controller: "homeCtrl"
          }
        }
      })
      .state('app.takePictures', {
        url: '/takePictures',
        views: {
          'menuContent': {
            templateUrl: 'templates/takePictures.html',
            controller: "takePicturesCtrl"
          }
        }
      })
      
    //$urlRouterProvider.otherwise('/app/home');
    var loginInfoString = window.localStorage.getItem("loginInfo");
    if (loginInfoString != null && loginInfoString != "") {
      loginUser = JSON.parse(loginInfoString);
      var cachePrestoreAccount = window.localStorage.getItem("PrestoreAccount");
      if (cachePrestoreAccount != null && cachePrestoreAccount != "") {
        currentPAInfo = JSON.parse(cachePrestoreAccount);
      }
      token = loginUser.Token;
      $urlRouterProvider.otherwise('/app/home');
    }
    else {
      $urlRouterProvider.otherwise('/login');
    }
  });