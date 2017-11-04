app.controller('itemController', ['$scope', '$modal','CommonService','dashBoardService','HttpService',
    function ($scope, $modal,  CommonService,dashBoardService,HttpService) {
    $scope.itemDetails = {};
    $scope.itemDetails.itemList = [];
    $scope.itemDetails.page = 0;
    $scope.pageSize = 20;
    $scope.itemDetails.itemList=[
        /*{
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
        }*/
    ];
    $scope.itemDetails.subCategoryList = [
        /*{
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
        }*/
    ];
    function managePagination(itemDetails) {
        $scope.itemDetails.itemList=itemDetails.content;
        $scope.itemDetails.totalPages = itemDetails.totalPages;
        $scope.itemDetails.isFirstPage = itemDetails.first;
        $scope.itemDetails.isLastPage = itemDetails.last;
        $scope.itemDetails.page = itemDetails.number;
        $scope.itemDetails.pagination = [];
        if ($scope.itemDetails.totalPages > 1) {
            $scope.itemDetails.pagination = CommonService.generatePagination($scope.itemDetails.totalPages, $scope.itemDetails.page);
        }
        $scope.itemDetails.limitStart = CommonService.checkLimitStart($scope.itemDetails.page, $scope.itemDetails.pagination.length);
    }

    function loadPage(pageNo) {
        HttpService.getAllSubCategories({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
             $scope.itemDetails.subCategoryList  = response.content;
        });
        HttpService.getAllItems({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
            $scope.itemDetails.itemList = response;
            managePagination(response);
        })
    }

    var modalAddEdit;
    $scope.itemAddEdit = function (type, value) {
        var itemAddEditScope = $scope.$new(true);
        itemAddEditScope.type = type;
        itemAddEditScope.submitForm = false;
        itemAddEditScope.subCategoryList = $scope.itemDetails.subCategoryList;
        itemAddEditScope.img="";

        itemAddEditScope.uploadFile = function(files) {
            itemAddEditScope.img=files[0];
        }

        if (type == "Edit") {
            itemAddEditScope.itemDetails = value;
        }
        else {
            itemAddEditScope.itemDetails = {
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
        itemAddEditScope.itemSubmit = function () {

            if (itemAddEditScope.itemDetails.name && itemAddEditScope.itemDetails.subCategory.id>0) {
                HttpService.saveItem(itemAddEditScope.itemDetails, function (response) {
                    var file = itemAddEditScope.img;
                    var uploadUrl = "http://presly:8082" + '/ebuy-cart-service/cart/uploadItemImage?itemId='+response.id;
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
                itemAddEditScope.submitForm = true;
            }
        };

        modalAddEdit = $modal({
            scope: itemAddEditScope,
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

    $scope.confirmDelete = function () {
        HttpService.deleteItem({"id":$scope.selectedId},function (response) {
            loadPage(0)
        })
    };
    int();

    var mapScope;
    $scope.viewImage = function(id){
        /* var url="http://maps.google.com/maps?z=12&t=m&q=loc:"+latitude+"+"+longitude;
    
         window.open(url,'_blank');*/

        mapScope = $scope.$new(true);
        mapScope.item={};
        mapScope.item.id=id;
        mapScope.item.imgUrl="http://presly:8082/ebuy-cart-service/cart/getImageByTitleId/"+id;

        mapScope.render = true;
        modal = $modal({scope: mapScope, templateUrl: "views/imageView.html",
            /*resolve: {
                lat: function () {
                    return mapScope.longitude;
                },
                lng: function () {
                    return mapScope.latitude;
                }
            },*/
            show: true,backdrop: 'static'});

/*        NgMap.getMap().then(function (map) {
            google.maps.event.trigger(map, "resize");
        });*/
    };
}]);
