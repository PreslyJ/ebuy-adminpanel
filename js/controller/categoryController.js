app.controller('categoryController', ['$scope', '$modal', 'CommonService', 'dashBoardService', 'HttpService',
    function ($scope, $modal, CommonService, dashBoardService, HttpService) {


        $scope.categoryDetails = {};
        $scope.categoryDetails.catogoryList = [];
        $scope.categoryDetails.page = 0;
        $scope.pageSize = 20;
        $scope.categoryDetails.categoryList = [
            // {
            //     "name": "Baby Toys",
            //     "description": "Toys for babies",
            //     "isActive":true,
            //     "id": 1
            // },
            // {
            //     "name": "Baby Toys",
            //     "description": "Toys for babies",
            //     "isActive":false,
            //     "id": 1
            // }
        ];
        function managePagination(categoryDetails) {
            $scope.categoryDetails.categoryList=categoryDetails.content;
            $scope.categoryDetails.totalPages = categoryDetails.totalPages;
            $scope.categoryDetails.isFirstPage = categoryDetails.first;
            $scope.categoryDetails.isLastPage = categoryDetails.last;
            $scope.categoryDetails.page = categoryDetails.number;
            $scope.categoryDetails.pagination = [];
            if ($scope.categoryDetails.totalPages > 1) {
                $scope.categoryDetails.pagination = CommonService.generatePagination($scope.categoryDetails.totalPages, $scope.categoryDetails.page);
            }
            $scope.categoryDetails.limitStart = CommonService.checkLimitStart($scope.categoryDetails.page, $scope.categoryDetails.pagination.length);
        }

        function loadPage(pageNo) {
            HttpService.getAllCategories({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
                $scope.categoryDetails.catogoryList = response;
                managePagination(response);
            })
        }

        var modalAddEdit;
        $scope.categoryAddEdit = function (type, value) {
            var categoryAddEditScope = $scope.$new(true);
            categoryAddEditScope.type = type;
            categoryAddEditScope.submitForm = false;

            if (type == "Edit") {
                categoryAddEditScope.categoryDetails = value;
            }
            else {
                categoryAddEditScope.categoryDetails = {
                    "name": "",
                    "description": "",
                    "isActive": true
                }
            }
            categoryAddEditScope.categorySubmit = function () {
                if (categoryAddEditScope.categoryDetails.name) {
                    HttpService.saveCategory(categoryAddEditScope.categoryDetails, function (response) {
                        loadPage();
                        modalAddEdit.$promise.then(modalAddEdit.hide);

                    });
                }
                else {
                    categoryAddEditScope.submitForm = true;
                }
            };

            modalAddEdit = $modal({
                scope: categoryAddEditScope,
                templateUrl: "views/category/addEditCategory.html",
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
                $scope.categoryDetails.page = $scope.categoryDetails.page - 1;
                loadPage($scope.categoryDetails.page);
            }
            else {
                $scope.categoryDetails.page = $scope.categoryDetails.page + 1;
                loadPage($scope.categoryDetails.page);
            }
        };
        $scope.deleteCategory = function(id){
            $scope.selectedId = id
        };
        $scope.confirmDelete= function () {
            HttpService.deleteCategory({"id":$scope.selectedId},function (response) {
                loadPage(0)
            })
        };
        int();
    }]);
