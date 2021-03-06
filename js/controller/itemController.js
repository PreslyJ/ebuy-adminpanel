app.controller('itemController', ['$scope', '$modal','host','CommonService','HttpService',
    function ($scope, $modal,host,CommonService,HttpService) {
    $scope.itemDetails = {};
    $scope.itemDetails.itemList = [];
    $scope.itemDetails.page = 0;
    $scope.pageSize = 6;
    $scope.itemDetails.itemList=[];
    $scope.itemDetails.subCategoryList = [];
    $scope.host=host.get();
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

        HttpService.getAllSubCategories({},function (response) {
             $scope.itemDetails.subCategoryList  = response.content;
        });
        HttpService.getAllItems({"page": pageNo, "size": $scope.pageSize, sort: 'id'},{}, function (response) {
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
                    var uploadUrl = host.get()+host.cartport()+'/ebuy-cart-service/cart/uploadItemImage?itemId='+response.id;
                    
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
        mapScope = $scope.$new(true);
        mapScope.item={};
        mapScope.item.id=id;
        mapScope.item.imgUrl=host.get()+host.cartport()+"/ebuy-cart-service/cart/getImageByTitleId/"+id;
        mapScope.render = true;
        modal = $modal({scope: mapScope, templateUrl: "views/imageView.html",
        show: true,backdrop: 'static'});

    };
}]);
