app.controller('subCategoryController', ['$scope', '$modal','CommonService','dashBoardService','HttpService',
    function ($scope, $modal,  CommonService,dashBoardService,HttpService) {

    $scope.subCategoryDetails = {};
    $scope.subCategoryDetails.catogoryList = [];
    $scope.subCategoryDetails.page = 0;
    $scope.pageSize = 20;
    $scope.subCategoryDetails.categoryList = [
        /*{
            "name": "Baby Toys",
            "description": "Toys for babies",
            "isActive":true,
            "id": 1
        },
        {
            "name": "Baby Toys  2",
            "description": "Toys for babies",
            "isActive":false,
            "id": 2
        }*/
    ];
    $scope.subCategoryDetails.subCategoryList = [
       /* {          "id": 1,
            "name": "Baby Toys",
            "description": "Toys for babies",
            "category": {
                "name": "Baby Items",
                "description": "Items for babies",
                "id": 1
            }
        },
        {          "id": 2,
            "name": "Baby Toys 2",
            "description": "Toys for babies",
            "category": {
                "name": "Baby Items",
                "description": "Items for babies",
                "id": 2
            }
        }*/
    ];
    function managePagination(subCategoryDetails) {
        $scope.subCategoryDetails.subCategoryList=subCategoryDetails.content;
        $scope.subCategoryDetails.totalPages = subCategoryDetails.totalPages;
        $scope.subCategoryDetails.isFirstPage = subCategoryDetails.first;
        $scope.subCategoryDetails.isLastPage = subCategoryDetails.last;
        $scope.subCategoryDetails.page = subCategoryDetails.number;
        $scope.subCategoryDetails.pagination = [];
        if ($scope.subCategoryDetails.totalPages > 1) {
            $scope.subCategoryDetails.pagination = CommonService.generatePagination($scope.subCategoryDetails.totalPages, $scope.subCategoryDetails.page);
        }
        $scope.subCategoryDetails.limitStart = CommonService.checkLimitStart($scope.subCategoryDetails.page, $scope.subCategoryDetails.pagination.length);
    }

    function loadPage(pageNo) {
        HttpService.getAllSubCategories({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
            //$scope.subCategoryDetails.subCategoryList = response;
            managePagination(response);
        });

        HttpService.getAllCategories({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
           $scope.subCategoryDetails.categoryList =  response.content;
        })

    }

    var modalAddEdit;
    $scope.subCategoryAddEdit = function (type, value) {
        var subCategoryAddEditScope = $scope.$new(true);
        subCategoryAddEditScope.type = type;
        subCategoryAddEditScope.submitForm = false;
        subCategoryAddEditScope.categoryList = $scope.subCategoryDetails.categoryList;

        if (type == "Edit") {
            subCategoryAddEditScope.subCategoryDetails = value;
        }
        else {
            subCategoryAddEditScope.subCategoryDetails = {
                "name": "",
                "description": "",
                "isActive": true,
                "category":{
                    "id":""
                }
            }
        }
        subCategoryAddEditScope.subCategorySubmit = function () {
            if (subCategoryAddEditScope.subCategoryDetails.name && subCategoryAddEditScope.subCategoryDetails.category) {
                HttpService.saveSubCategory(subCategoryAddEditScope.subCategoryDetails, function (response) {
                    loadPage();
                    modalAddEdit.$promise.then(modalAddEdit.hide);
                });
            }
            else {
                subCategoryAddEditScope.submitForm = true;
            }
        };

        modalAddEdit = $modal({
            scope: subCategoryAddEditScope,
            templateUrl: "views/category/addEditSubCategory.html",
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
            $scope.subCategoryDetails.page = $scope.subCategoryDetails.page - 1;
            loadPage($scope.subCategoryDetails.page);
        }
        else {
            $scope.subCategoryDetails.page = $scope.subCategoryDetails.page + 1;
            loadPage($scope.subCategoryDetails.page);
        }
    };
    $scope.deleteSubCategory = function(id){
        $scope.selectedId = id
    };
    $scope.confirmDelete= function () {
        HttpService.deleteCategory({"id":$scope.selectedId},function (response) {
            loadPage(0)
        })
    };
    int();

}]);
