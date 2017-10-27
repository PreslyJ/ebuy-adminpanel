app.controller('itemController', ['$scope', '$modal','CommonService','dashBoardService','HttpService',
    function ($scope, $modal,  CommonService,dashBoardService,HttpService) {
    $scope.itemDetails = {};
    $scope.itemDetails.itemList = [];
    $scope.itemDetails.page = 0;
    $scope.pageSize = 20;
    $scope.itemDetails.itemList=[
        {
            "id": 2,
            "name": "Test",
            "description": "Test",
            "subCategory": {
                "id": 1,
                "name": "Baby Toys",
                "description": "Toys for babies",
                "category": {
                    "name": "Baby Items",
                    "description": "Items for babies",
                    "status": "active",
                    "lupDate": null,
                    "id": 2
                },
                "status": "active",
                "lupDate": null
            },
            "minAge": 0,
            "maxAge": 0,
            "price": 200,
            "quantity": 0,
            "size": null,
            "otherProperties": null,
            "lupDate": 1506778270327,
            "status": "active",
            "featured": true,
            "recomended": true
        },
        {
            "id": 1,
            "name": "Test2",
            "description": "Test",
            "subCategory": {
                "id": 1,
                "name": "Baby Toys",
                "description": "Toys for babies",
                "category": {
                    "name": "Baby Items",
                    "description": "Items for babies",
                    "status": "active",
                    "lupDate": null,
                    "id": 2
                },
                "status": "active",
                "lupDate": null
            },
            "minAge": 0,
            "maxAge": 0,
            "price": 200,
            "quantity": 0,
            "size": null,
            "otherProperties": null,
            "lupDate": 1506778270327,
            "status": "active",
            "featured": true,
            "recomended": true
        }
    ];
    $scope.itemDetails.subCategoryList = [
        {
            "id": 1,
            "name": "Baby Toys",
            "description": "Toys for babies",
            "category": {
                "name": "Baby Items",
                "description": "Items for babies",
                "id": 1
            }
        },
        {
            "id": 2,
            "name": "Baby Toys 2",
            "description": "Toys for babies",
            "category": {
                "name": "Baby Items",
                "description": "Items for babies",
                "id": 2
            }
        }
    ];
    function managePagination(itemDetails) {
        $scope.itemDetails.totalPages = itemDetails.totalPages;
        $scope.itemDetails.isFirstPage = itemDetails.first;
        $scope.itemDetails.isLastPage = itemDetails.last;
        $scope.itemDetails.page = itemDetails.number;
        $scope.itemDetails.pagination = [];
        if ($scope.itemDetails.totalPages > 1) {
            $scope.itemDetails.pagination = itemDetails.generatePagination($scope.itemDetails.totalPages, $scope.itemDetails.page);
        }
        $scope.itemDetails.limitStart = itemDetails.checkLimitStart($scope.itemDetails.page, $scope.itemDetails.pagination.length);
    }

    function loadPage(pageNo) {
        HttpService.getAllItems({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
            $scope.itemDetails.itemList = response;
            managePagination(response);
        })
    }

    var modalAddEdit;
    $scope.itemAddEdit = function (type, value) {
        var subCategoryAddEditScope = $scope.$new(true);
        subCategoryAddEditScope.type = type;
        subCategoryAddEditScope.submitForm = false;
        subCategoryAddEditScope.subCategoryList = $scope.itemDetails.subCategoryList;

        if (type == "Edit") {
            subCategoryAddEditScope.itemDetails = value;
        }
        else {
            subCategoryAddEditScope.itemDetails = {
                "name": "",
                "description": "",
                "subCategory": {
                    "id":'',
                },
                "minAge": "",
                "maxAge": "",
                "price": "",
                "quantity": "",
                "size": "",
                "otherProperties": "",
                "lupDate": 1506778270327,
                "status": "active",
                "featured": true,
                "recomended": true
            }
        }
        subCategoryAddEditScope.itemSubmit = function () {
            if (subCategoryAddEditScope.itemDetails.name && subCategoryAddEditScope.itemDetails.category) {
                HttpService.saveItem(subCategoryAddEditScope.itemDetails, function (response) {
                    var file = subCategoryAddEditScope.myFile;
                    var uploadUrl = "http://localhost/ebuy" + '/ebuy-cart-service/cart/uploadItemImage?itemId='+response.id;
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
                subCategoryAddEditScope.submitForm = true;
            }
        };

        modalAddEdit = $modal({
            scope: subCategoryAddEditScope,
            templateUrl: "views/product/addEditItem.html",
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
            $scope.itemDetails.page = $scope.itemDetails.page - 1;
            loadPage($scope.itemDetails.page);
        }
        else {
            $scope.itemDetails.page = $scope.itemDetails.page + 1;
            loadPage($scope.itemDetails.page);
        }
    };
    $scope.deleteItem = function(id){
        $scope.selectedId = id
    };
    $scope.confirmDelete= function () {
        HttpService.deleteCategory({"id":$scope.selectedId},function (response) {
            loadPage(0)
        })
    };
    int();


}]);
