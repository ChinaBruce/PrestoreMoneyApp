angular.module('starter.controllers', [])
    .controller("menuCtrl", function ($scope, $state, $http, $cordovaToast) {
        $scope.loginName = loginUser.Name;
        $scope.logout = function () {
            var timestamp = (new Date()).valueOf();
            var signature = md5('Logout' + timestamp + signatureKey);
            $http({
                method: 'PUT',
                url: remoteUrl + 'Account/Logout',
                headers: { 'apptype': apptype, 'timestamp': timestamp, 'signature': signature, 'token': token }
            }).success(function (response) {
                window.localStorage.removeItem("loginInfo");
                window.localStorage.removeItem("PrestoreAccount");
                token = "";
                UUID = "";
                loginUser = null;
                currentPAInfo = null;
                $state.go('login');
            }).error(function (response) {
                $cordovaToast.showShortTop(response.Message);
            });
        }
    })
    //登录
    .controller("loginCtrl", function ($scope, $rootScope, $http, $state, $ionicPlatform, $cordovaToast, $cordovaDevice, $ionicLoading,$cordovaFileOpener2) {
        $ionicPlatform.ready(function () {
            cordova.getAppVersion(function (version) {
                $scope.appVersion = version;
            });
        });

        $scope.initData = function () {
            $scope.user = {
                username: "",
                password: "",
                isremember: false
            };
            $scope.appVersion = "";
        };
        $scope.doLogin = function () {
            UUID = $cordovaDevice.getUUID();
            if ($scope.user.username == "" || $scope.user.password == "") {
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
                    $state.go('app.home');
                }
                else {
                    $cordovaToast.showShortTop(response.Message);
                }
            }).error(function (response) {
                $ionicLoading.hide();
                $cordovaToast.showShortTop(response.Message);
            });
        };

        
    })
    //查询
    .controller("searchCtrl", function ($scope, $rootScope, $http, $state, $ionicLoading, $cordovaToast, $stateParams) {
        $scope.items = {};
        $scope.searchByKey = function (strInput) {
            var timestamp = (new Date()).valueOf();
            var signature = md5('Search' + timestamp + signatureKey);
            $http({
                method: 'GET',
                url: remoteUrl + 'PrestoreAccounts?key=' + strInput,
                headers: { 'apptype': apptype, 'timestamp': timestamp, 'signature': signature, 'token': token }
            }).success(function (response) {
                if (response.IsSuccess) {
                    $scope.items = response.Data;
                }
                else {
                    $cordovaToast.showShortTop(response.Message);
                }
            }).error(function (response) {
                $cordovaToast.showShortTop(response.Message);
            });
        };

        $scope.selectItem = function (item) {
            if (item != undefined) {
                currentPAInfo = item;
                window.localStorage.setItem("PrestoreAccount", JSON.stringify(item));
                $state.go($stateParams.backUrl);
            }
        };

        $scope.cancelSearch = function () {
            $state.go($stateParams.backUrl);
        };
    })
    //登记问题
    .controller("recordCtrl", function ($scope, $rootScope, $http, $state, $ionicLoading, $cordovaToast) {
        $scope.$on("$ionicView.enter", function (event, data) {
            if (currentPAInfo == undefined) {
                $state.go("app.search", { backUrl: "app.record" });
            }
        });
        $scope.entity = { elseRegulation: "" };
        var timestamp = (new Date()).valueOf();
        var signature = md5('GetDictionaryDetails' + timestamp + signatureKey);
        $http({
            method: 'GET',
            url: remoteUrl + 'DictionaryDetails?code=03',
            headers: { 'apptype': apptype, 'timestamp': timestamp, 'signature': signature }
        }).success(function (response) {
            if (response.IsSuccess) {
                $scope.items = response.Data;
            }
            else {
                $cordovaToast.showShortTop(response.Message);
            }
        }).error(function (response) {
            $cordovaToast.showShortTop(response.Message);
        });

        $scope.save = function () {
            //显示加载动画
            $ionicLoading.show({
                content: '',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            var describtion = "";
            $scope.items.forEach(function (element) {
                if (element.IsChecked) {
                    describtion += element.Name + "@"
                }
            }, this);
            if ($scope.entity.elseRegulation != "") {
                describtion += $scope.entity.elseRegulation + "@"
            }
            if (describtion != "") {
                describtion = describtion.substring(0, describtion.length - 1);
            }
            var timestamp = (new Date()).valueOf();
            var signature = md5('Add' + timestamp + signatureKey);
            $http({
                method: 'POST',
                url: remoteUrl + 'LocaleRegulation',
                data: JSON.stringify({ PrestoreAccountId: currentPAInfo.Id, CheckUserId: loginUser.UserId, Describe: describtion }),
                headers: { 'Content-Type': 'application/json', 'apptype': apptype, 'timestamp': timestamp, 'signature': signature, 'token': token }
            }).success(function (response) {
                $ionicLoading.hide();
                if (response.IsSuccess) {
                    $scope.entity.elseRegulation = "";
                    $scope.items.forEach(function (element) {
                        element.IsChecked = false;
                    }, this);
                    $cordovaToast.showShortTop(response.Message);
                }
                else {
                    $cordovaToast.showShortTop(response.Message);
                }
            }).error(function (response) {
                $ionicLoading.hide();
                $cordovaToast.showShortTop(response.Message);
            });
        };
    })
    //基本信息
    .controller("homeCtrl", function ($scope, $rootScope, $http, $state, $ionicLoading, $cordovaToast) {
        $scope.pavm = {};
        $scope.$on("$ionicView.enter", function (event, data) {
            if (currentPAInfo == undefined) {
                $state.go("app.search", { backUrl: "app.home" });
            }
            else {
                $scope.pavm = currentPAInfo;
            }
        });
        $scope.SearchPA = function () {
            $state.go("app.search", { backUrl: "app.home" });
        };
        $scope.phonecallTab = function (phonenumber) {
            var call = "tel:" + phonenumber;
            document.location.href = call;
        };
    })
    //现场取证
    .controller("takePicturesCtrl", function ($scope, $rootScope, $http, $state, $ionicLoading, $cordovaToast, $cordovaCamera) {
        $scope.imageList = [];
        $scope.imageDataList = [];
        $scope.entity = { elseRegulation: "" };
        $scope.takePicture = function () {
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 600,
                targetHeight: 600,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                cameraDirection: 0
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.imageList.push("data:image/jpeg;base64," + imageData);
                $scope.imageDataList.push(imageData);
            }, function (err) {
                $cordovaToast.showShortTop(err);
            });
        };
        $scope.upload = function () {
            if ($scope.imageList.length == 0) {
                $cordovaToast.showShortTop("请拍照后再上传");
                return;
            }
            if ($scope.entity.elseRegulation == "") {
                $cordovaToast.showShortTop("描述不能为空");
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
            var timestamp = (new Date()).valueOf();
            var signature = md5('Add' + timestamp + signatureKey);
            $http({
                method: 'POST',
                url: remoteUrl + 'LocaleRegulation',
                data: JSON.stringify({ PrestoreAccountId: currentPAInfo.Id, CheckUserId: loginUser.UserId, Describe: $scope.entity.elseRegulation, ImageList: $scope.imageDataList }),
                headers: { 'Content-Type': 'application/json', 'apptype': apptype, 'timestamp': timestamp, 'signature': signature, 'token': token }
            }).success(function (response) {
                $ionicLoading.hide();
                if (response.IsSuccess) {
                    $cordovaToast.showShortTop(response.Message);
                    $scope.entity.elseRegulation = "";
                    $scope.imageList.splice(0, $scope.imageList.length);
                    $scope.imageDataList.splice(0, $scope.imageDataList.length);
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


