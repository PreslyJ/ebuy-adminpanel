app.controller('userController', ['$scope', '$modal','host','CommonService','HttpService',
    function ($scope, $modal,host,CommonService,HttpService) {
        $scope.userDetails = {};
        $scope.userDetails.userList = [];
        $scope.userDetails.page = 0;
        $scope.pageSize = 6;
        $scope.userDetails.userList=[];
        $scope.roleList = [
            {
                "role":"admin",
                "id":1
            },
            {
                "role":"web user",
                "id":2
            }
            ,
            {
                "role":"staff member",
                "id":3
            }
        ];
        $scope.userDetails.userList=[
            {
                "userName":"Dush",
                "roles":[{"role":"admin","id":1},{"role":"web user","id":2}],
                "id":"132582",
                "password":"12232"
            },
            {
                "userName":"Presly",
                "roles":[{"role":"admin","id":1},{"role":"web user","id":2}],
                "id":"5686568",
                "password":"12321"
            }

        ];
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
            })
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
                if (userAddEditScope.userDetails.userName && userAddEditScope.userDetails.password && userAddEditScope.userDetails.length ) {
                    HttpService.saveUser(userAddEditScope.userDetails, function (response) {
                        var file = userAddEditScope.img;
                        var uploadUrl = host.get()+host.cartport()+'/ebuy-cart-service/cart/uploadUserImage?userId='+response.id;

                        //CommonService.uploadFileToUrl(file, uploadUrl);
                        CommonService.uploadFileToUrl(file, uploadUrl)
                            .success(function () {
                                modal.$promise.then(modal.hide);

                            })
                            .error(function () {
                                //modal.$promise.then(modal.hide);
                            });
                        loadPage();
                        modalAddEdit.$promise.then(modalAddEdit.hide);
                    });
                }
                else {
                    userAddEditScope.submitForm = true;
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
