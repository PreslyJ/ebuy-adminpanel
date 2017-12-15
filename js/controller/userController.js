app.controller('userController', ['$scope', '$modal','host','CommonService','HttpService',
    function ($scope, $modal,host,CommonService,HttpService) {
        $scope.userDetails = {};
        $scope.userDetails.userList = [];
        $scope.userDetails.page = 0;
        $scope.pageSize = 6;
        $scope.userDetails.userList=[];
        $scope.roleList = [  ];
        $scope.userDetails.userList=[  ];
        $scope.host=host.get();
        function managePagination(userDetails) {
            $scope.userDetails.userList=userDetails.content;
            $scope.userDetails.totalPages = userDetails.totalPages;
            $scope.userDetails.isFirstPage = userDetails.first;
            $scope.userDetails.isLastPage = userDetails.last;
            $scope.userDetails.page = userDetails.number;
            $scope.userDetails.pagination = [];
            if ($scope.userDetails.totalPages > 1) {
                $scope.userDetails.pagination = CommonService.generatePagination($scope.userDetails.totalPages, $scope.userDetails.page);
            }
            $scope.userDetails.limitStart = CommonService.checkLimitStart($scope.userDetails.page, $scope.userDetails.pagination.length);
        }

        function loadPage(pageNo) {

            HttpService.getAllUsers({"page": pageNo, "size": $scope.pageSize, sort: 'id'},{}, function (response) {
                $scope.userDetails.userList = response;
                managePagination(response);
            });

            HttpService.getAllRoles({},{}, function (response) {
                $scope.roleList = response.content;
                
            });

        }

        var modalAddEdit;
        $scope.userAddEdit = function (type, value) {
            var userAddEditScope = $scope.$new(true);
            userAddEditScope.type = type;
            userAddEditScope.submitForm = false;
            userAddEditScope.selectedRole = {};
            userAddEditScope.roleList = angular.copy($scope.roleList);

            if (type == "Edit") {
                userAddEditScope.userDetails = value;
                if(userAddEditScope.userDetails.roles.length){
                    angular.forEach(userAddEditScope.userDetails.roles,function(role){
                        userAddEditScope.roleList.splice(userAddEditScope.roleList.indexOf(role), 1)
                    })
                }
            }
            else {
                userAddEditScope.userDetails = {
                    "userName": "",
                    "password": "",
                    "roles":[]
                }
            }
            userAddEditScope.addRole= function (role) {
                userAddEditScope.userDetails.roles.push(role);
                userAddEditScope.roleList.splice(userAddEditScope.roleList.indexOf(role), 1);
                userAddEditScope.selectedRole = {};
            };
            userAddEditScope.deleteRole = function(role){
                userAddEditScope.roleList.push(role);
                userAddEditScope.userDetails.roles.splice(userAddEditScope.userDetails.roles.indexOf(role), 1);
                userAddEditScope.selectedRole = {};
            };
            userAddEditScope.userSubmit = function () {
                
                userAddEditScope.submitForm = true;

                if(userAddEditScope.userDetails.password &&  userAddEditScope.userDetails.password.length<8)
                    userAddEditScope.userDetails.length=false;
                else
                    userAddEditScope.userDetails.length=true;

                if (userAddEditScope.userDetails.username && userAddEditScope.userDetails.password && userAddEditScope.userDetails.length && userAddEditScope.userDetails.firstName && userAddEditScope.userDetails.surname ) {
                    HttpService.saveUser(userAddEditScope.userDetails, function (response) {
/*                        var file = userAddEditScope.img;
                        var uploadUrl = host.get()+host.cartport()+'/ebuy-cart-service/cart/uploadUserImage?userId='+response.id;

                        //CommonService.uploadFileToUrl(file, uploadUrl);
                        CommonService.uploadFileToUrl(file, uploadUrl)
                            .success(function () {
                                modal.$promise.then(modal.hide);

                            })
                            .error(function () {
                                //modal.$promise.then(modal.hide);
                            });*/
                        loadPage();
                        userAddEditScope.submitForm = false;    
                        modalAddEdit.$promise.then(modalAddEdit.hide);
                    }, function(error) {
                        if('usernameExists'==error.data.message)                        
                              userAddEditScope.userDetails.userExists=true;
                    });
                    
                }
            };

            modalAddEdit = $modal({
                scope: userAddEditScope,
                templateUrl: "views/user/ADDEditUser.html",
                show: true,
                backdrop: 'static'
            });
        };

        function int() {
            loadPage();
        }

        $scope.reloadContent = function () {
            loadPage();
        };
        $scope.loadNextPage = function (id) {
            loadPage(id);
        };

        $scope.pageNavigation = function (type) {
            if (type === "prev") {
                $scope.userDetails.page = $scope.userDetails.page - 1;
                loadPage($scope.userDetails.page);
            }
            else {
                $scope.userDetails.page = $scope.userDetails.page + 1;
                loadPage($scope.userDetails.page);
            }
        };
        $scope.deleteUser = function(id){
            $scope.selectedId = id
        };

        $scope.confirmDelete = function () {
            HttpService.deleteUser({"id":$scope.selectedId},function (response) {
                loadPage(0)
            })
        };
        int();

    }]);
