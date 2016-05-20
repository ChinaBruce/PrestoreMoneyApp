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
    .controller("loginCtrl", function ($scope, $rootScope, $http, $state, $ionicPlatform, $cordovaToast, $cordovaDevice, $ionicLoading) {
        $ionicPlatform.ready(function () {
            cordova.getAppVersion(function (version) {
                $scope.appVersion = version;
            });
            
            //checkUpdate();
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

        // 检查更新
        function checkUpdate() {
            var serverAppVersion = "1.0.0"; //从服务端获取最新版本
            //获取版本
            $cordovaAppVersion.getAppVersion().then(function (version) {
                //如果本地与服务端的APP版本不符合
                if (version != serverAppVersion) {
                    showUpdateConfirm();
                }
            });
        }

        // 显示是否更新对话框
        function showUpdateConfirm() {
            var confirmPopup = $ionicPopup.confirm({
                title: '版本升级',
                template: '1.xxxx;</br>2.xxxxxx;</br>3.xxxxxx;</br>4.xxxxxx', //从服务端获取更新的内容
                cancelText: '取消',
                okText: '升级'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                        template: "已经下载：0%"
                    });
                    // var url = "http://192.168.1.50/1.apk"; //可以从服务端获取更新APP的路径
                    // var targetPath = "file:///storage/sdcard0/Download/1.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                    // var trustHosts = true
                    // var options = {};
                    // $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                    //   // 打开下载下来的APP
                    //   $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                    //   ).then(function () {
                    //     // 成功
                    //   }, function (err) {
                    //     // 错误
                    //   });
                    //   $ionicLoading.hide();
                    // }, function (err) {
                    //   alert('下载失败');
                    // }, function (progress) {
                    //   //进度，这里使用文字显示下载百分比
                    //   $timeout(function () {
                    //     var downloadProgress = (progress.loaded / progress.total) * 100;
                    //     $ionicLoading.show({
                    //       template: "已经下载：" + Math.floor(downloadProgress) + "%"
                    //     });
                    //     if (downloadProgress > 99) {
                    //       $ionicLoading.hide();
                    //     }
                    //   })
                    // });
                } else {
                    // 取消更新
                }
            });
        }
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


