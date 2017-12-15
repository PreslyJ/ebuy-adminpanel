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

        HttpService.getAllStockItems({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, {} , function (response) {
            managePagination(response);
        });

        HttpService.getAllItems({}, {} , function (response) {
           $scope.stockItems.itemsList =  response.content;
        })

    }

    var modalAddEdit;
    $scope.stockItemAddEdit = function (type, value) {
        var stockItemsAddEditScope = $scope.$new(true);
        stockItemsAddEditScope.type = type;
        stockItemsAddEditScope.submitForm = false;
        stockItemsAddEditScope.itemsList = $scope.stockItems.itemsList;

        if (type == "Edit") {
            stockItemsAddEditScope.stockItems = value;
        }
        else {
            stockItemsAddEditScope.stockItems = {
                "name": "",
                "description": "",
                "isActive": true,
                "status":"active",
                "category":{
                    "id":""
                }
            }
        }
        stockItemsAddEditScope.stockItemsSubmit = function () {
            if (stockItemsAddEditScope.stockItems.buyingPrice && stockItemsAddEditScope.stockItems.item &&  stockItemsAddEditScope.stockItems.noOfItems) {
                HttpService.saveStockItems(stockItemsAddEditScope.stockItems, function (response) {
                    loadPage();
                    modalAddEdit.$promise.then(modalAddEdit.hide);
                });
            }
            else {
                stockItemsAddEditScope.submitForm = true;
            }
        };

        modalAddEdit = $modal({
            scope: stockItemsAddEditScope,
            templateUrl: "views/product/addEditStockItem.html",
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
