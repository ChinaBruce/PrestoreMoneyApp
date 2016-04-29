angular.module('starter.controllers', [])
    .controller("appCtrl", function ($scope, $state, $http) {
        $scope.logout = function () {
            var timestamp = (new Date()).valueOf();
            var signature = md5('Logout' + timestamp + signatureKey);
            $http({
                method: 'GET',
                url: remoteUrl + 'Account/Logout',
                headers: { 'apptype': '2', 'timestamp': timestamp, 'signature': signature, 'token': token }
            }).success(function (response) {
                if (response.IsSuccess) {
                    $state.go('login');
                }
                else
                {
                    alert(response.Message);
                }
            }).error(function (response) {
                console.log(response);
            });
        }
    })
    .controller("loginCtrl", function ($scope, $http, $state, $ionicModal) {

        $scope.user = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.doLogin = function () {
            var data = 'name=' + $scope.user.username + '&password=' + md5($scope.user.password) + '&deviceUniqueId=123testsdsdfsdf';
            var timestamp = (new Date()).valueOf();
            var signature = md5('Login' + timestamp + signatureKey);
            $http({
                method: 'GET',
                url: remoteUrl + 'Account/Login?' + data,
                headers: { 'apptype': '2', 'timestamp': timestamp, 'signature': signature }
            }).success(function (response) {
                if (response.IsSuccess) {
                    token = response.Data.Token;
                    $state.go('app.record');
                }
                else
                {
                    alert(response.Message);
                }
            }).error(function (response) {
                console.log(response);
            });
        };
    });