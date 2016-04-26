angular.module('starter.controllers', [])
    .controller("appCtrl", function ($scope, $state) {
        $scope.logout = function () {
            $state.go('login');
        }
    })
    .controller("loginCtrl", function ($scope, $http, $state,$cordovaAppVersion) {
        $scope.user.version = $cordovaAppVersion.getVersionNumber() //获取版本号
        $scope.login = function () {
            // var data = 'name=' + $scope.user.name + '&password=' + $scope.user.password + '&deviceType=1&deviceUniqueId=123testsdsdfsdf';
            // var timestamp = (new Date()).valueOf();
            // var signature = md5('Login' + timestamp + 'prestoremoney.common.2016');
            // $http({
            //     method: 'GET',
            //     url: 'http://192.168.51.52:88/api/Account/Login?' + data,
            //     headers: { 'apptype': '2', 'timestamp': timestamp, 'signature': signature }
            // }).success(function (data) {
            //     console.log(data);
            // }).error(function (data) {
            //     console.log(data);
            // });
            $state.go('app.record');
        }
    });