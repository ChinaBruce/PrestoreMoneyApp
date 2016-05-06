angular.module('starter.controllers', [])
    .controller("appCtrl", function ($scope, $state, $http, $cordovaToast) {
        $scope.loginName = loginUser.Name;
        $scope.logout = function () {
            var timestamp = (new Date()).valueOf();
            var signature = md5('Logout' + timestamp + signatureKey);
            $http({
                method: 'GET',
                url: remoteUrl + 'Account/Logout',
                headers: { 'apptype': '2', 'timestamp': timestamp, 'signature': signature, 'token': token }
            }).success(function (response) {
                window.localStorage.removeItem("loginInfo");                
                $state.go('login');
            }).error(function (response) {
                $cordovaToast.showShortTop(response.Message);
            });
        }
    })
    .controller("loginCtrl", function ($scope, $rootScope, $http, $state, $ionicPlatform, $cordovaToast, $cordovaDevice, $ionicLoading) {
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
            if($scope.user.username == "" || $scope.user.password == "")
            {
                $cordovaToast.showShortTop("请输入用户名和密码");
                return;
            }
            //显示加载动画
            $ionicLoading.show({
                content: '',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            
            var data = 'name=' + $scope.user.username + '&password=' + md5($scope.user.password) + '&deviceUniqueId=' + UUID;
            var timestamp = (new Date()).valueOf();
            var signature = md5('Login' + timestamp + signatureKey);
            $http({
                method: 'GET',
                url: remoteUrl + 'Account/Login?' + data,
                headers: { 'apptype': apptype, 'timestamp': timestamp, 'signature': signature }
            }).success(function (response) {
                $ionicLoading.hide();
                if (response.IsSuccess) {
                    loginUser = response.Data;
                    if ($scope.user.isremember) {                        
                        window.localStorage.setItem("loginInfo", JSON.stringify(loginUser));
                    }
                    else {
                        window.localStorage.clear();
                    }
                    token = loginUser.Token;
                    $state.go('app.record');
                }
                else {
                    $cordovaToast.showShortTop(response.Message);
                }                
            }).error(function (response) {
                $ionicLoading.hide();
                $cordovaToast.showShortTop(response.Message);                
            });
        };
    });


