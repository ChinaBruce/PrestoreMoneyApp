angular.module('starter.controllers', [])
    .controller("appCtrl", function ($scope, $state, $http, $cordovaToast) {
        $scope.logout = function () {
            var timestamp = (new Date()).valueOf();
            var signature = md5('Logout' + timestamp + signatureKey);
            $http({
                method: 'GET',
                url: remoteUrl + 'Account/Logout',
                headers: { 'apptype': '2', 'timestamp': timestamp, 'signature': signature, 'token': token }
            }).success(function (response) {
                window.localStorage.removeItem("username");
                window.localStorage.removeItem("password");
                window.localStorage.removeItem("token");
                $state.go('login');
            }).error(function (response) {
                $cordovaToast.showShortTop(response.Message);
            });
        }
    })
    .controller("loginCtrl", function ($scope, $rootScope, $http, $state, $ionicPlatform, $cordovaToast, $cordovaDevice) {
        $scope.user = {
            username: "",
            password: "",
            isremember: false
        };
        $scope.appVersion = "";
        $ionicPlatform.ready(function ($rootScope) {
            cordova.getAppVersion(function (version) {
                $scope.appVersion = version;
            });
        });
        $scope.doLogin = function () {
            UUID = $cordovaDevice.getUUID();
            var apptype = 0;
            if ($cordovaDevice.getPlatform() == "Android") {
                apptype = 2;
            }
            else if ($cordovaDevice.getPlatform() == "iOS") {
                apptype = 1;
            }
            var data = 'name=' + $scope.user.username + '&password=' + md5($scope.user.password) + '&deviceUniqueId=' + UUID;
            var timestamp = (new Date()).valueOf();
            var signature = md5('Login' + timestamp + signatureKey);
            $http({
                method: 'GET',
                url: remoteUrl + 'Account/Login?' + data,
                headers: { 'apptype': apptype, 'timestamp': timestamp, 'signature': signature }
            }).success(function (response) {
                if (response.IsSuccess) {
                    if ($scope.user.isremember) {
                        window.localStorage.setItem("username", $scope.user.username);
                        window.localStorage.setItem("password", md5($scope.user.password));
                        window.localStorage.setItem("token", response.Data.Token);
                    }
                    else {
                        window.localStorage.clear();
                    }
                    token = response.Data.Token;
                    $state.go('app.record');
                }
                else {
                    $cordovaToast.showShortTop(response.Message);
                }
            }).error(function (response) {
                $cordovaToast.showShortTop(response.Message);
            });
        };
    });


