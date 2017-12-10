app.controller('stockItemController', ['$scope', '$modal','CommonService','HttpService',
    function ($scope, $modal,  CommonService,HttpService) {

    $scope.stockItems = {};
    $scope.stockItems.stockItemsList = [];
    $scope.stockItems.page = 0;
    $scope.pageSize = 20;
    $scope.stockItems.itemsList = [    ];
    $scope.stockItems.stockItemsList = [    ];
    
    function managePagination(stockItems) {
        $scope.stockItems.stockItemsList=stockItems.content;
        $scope.stockItems.totalPages = stockItems.totalPages;
        $scope.stockItems.isFirstPage = stockItems.first;
        $scope.stockItems.isLastPage = stockItems.last;
        $scope.stockItems.page = stockItems.number;
        $scope.stockItems.pagination = [];
        if ($scope.stockItems.totalPages > 1) {
            $scope.stockItems.pagination = CommonService.generatePagination($scope.stockItems.totalPages, $scope.stockItems.page);
        }
        $scope.stockItems.limitStart = CommonService.checkLimitStart($scope.stockItems.page, $scope.stockItems.pagination.length);
    }

    function loadPage(pageNo) {
        HttpService.getAllSubCategories({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
            //$scope.stockItems.subCategoryList = response;
            managePagination(response);
        });

        HttpService.getAllCategories({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
           $scope.stockItems.categoryList =  response.content;
        })

    }

    var modalAddEdit;
    $scope.subCategoryAddEdit = function (type, value) {
        var subCategoryAddEditScope = $scope.$new(true);
        subCategoryAddEditScope.type = type;
        subCategoryAddEditScope.submitForm = false;
        subCategoryAddEditScope.categoryList = $scope.stockItems.categoryList;

        if (type == "Edit") {
            subCategoryAddEditScope.stockItems = value;
        }
        else {
            subCategoryAddEditScope.stockItems = {
                "name": "",
                "description": "",
                "isActive": true,
                "status":"active",
                "category":{
                    "id":""
                }
            }
        }
        subCategoryAddEditScope.subCategorySubmit = function () {
            if (subCategoryAddEditScope.stockItems.name && subCategoryAddEditScope.stockItems.category) {
                HttpService.saveSubCategory(subCategoryAddEditScope.stockItems, function (response) {
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
            $scope.stockItems.page = $scope.stockItems.page - 1;
            loadPage($scope.stockItems.page);
        }
        else {
            $scope.stockItems.page = $scope.stockItems.page + 1;
            loadPage($scope.stockItems.page);
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
