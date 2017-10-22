app.controller('productController', ['$scope', '$modal', 'CommonService', 'dashBoardService', 'HttpService',
    function ($scope, $modal, CommonService, dashBoardService, HttpService) {


        $scope.productDetails = {};
        $scope.productDetails.productList = [];
        $scope.productDetails.page = 0;
        $scope.pageSize = 20;
        $scope.productDetails.productList = [{
            "id": 2,
            "name": "Test",
            "description": "Test",
            "isActive":true,
            "subCategory": {
                "id": 1,
                "name": "Baby Toys",
                "description": "Toys for babies",
                "category": {
                    "name": "Baby Items",
                    "description": "Items for babies",
                    "id": 2
                }
            },
            "items": [
                {
                    "id": 2,
                    "name": "Test",
                    "description": "Test",
                    "minAge": 0,
                    "maxAge": 0,
                    "price": 200,
                    "quantity": 0,
                    "size": null,
                    "otherProperties": null,
                    "lupDate": 1506778270327,
                    "featured": true,
                    "recomended": true
                }]
        },
            {
                "id": 3,
                "name": "Test2",
                "description": "Test2",
                "isActive":false,
                "subCategory": {
                    "id": 1,
                    "name": "Baby Toys",
                    "description": "Toys for babies",
                    "category": {
                        "name": "Baby Items",
                        "description": "Items for babies",
                        "id": 2
                    }
                },
                "items": [
                    {
                        "id": 2,
                        "name": "Test",
                        "description": "Test",
                        "minAge": 0,
                        "maxAge": 0,
                        "price": 200,
                        "quantity": 0,
                        "size": null,
                        "otherProperties": null,
                        "lupDate": 1506778270327,
                        "featured": true,
                        "recomended": true
                    }]
            }
        ];
        function managePagination(productDetails) {
            $scope.productDetails.totalPages = productDetails.totalPages;
            $scope.productDetails.isFirstPage = productDetails.first;
            $scope.productDetails.isLastPage = productDetails.last;
            $scope.productDetails.page = productDetails.number;
            $scope.productDetails.pagination = [];
            if ($scope.productDetails.totalPages > 1) {
                $scope.productDetails.pagination = productDetails.generatePagination($scope.productDetails.totalPages, $scope.productDetails.page);
            }
            $scope.productDetails.limitStart = productDetails.checkLimitStart($scope.productDetails.page, $scope.productDetails.pagination.length);
        }

        function loadPage(pageNo) {
            HttpService.getAllProducts({"page": pageNo, "size": $scope.pageSize, sort:'id'},function (response) {
                $scope.productDetails.productList = response;
                managePagination(response);
            })
        }
        var modalAddEdit;
        $scope.productAddEdit  = function (type,value) {
            var productAddEditScope = $scope.$new(true);
            productAddEditScope.type = type;
            productAddEditScope.submitForm = false;

            if(type =="Edit"){
                productAddEditScope.productDetails = value;
            }
            else{
                productAddEditScope.productDetails = {
                    "name":"",
                    "description":"",
                    "isActive":true
                }
            }
            productAddEditScope.productSubmit =function(){
                if(productAddEditScope.productDetails.name){
                    HttpService.saveProduct(productAddEditScope.productDetails,function(response){
                        loadPage();
                        modalAddEdit.$promise.then(modalAddEdit.hide);

                    });
                }
                else{
                    productAddEditScope.submitForm = true;
                }
            };

            modalAddEdit = $modal({scope: productAddEditScope, templateUrl: "views/product/addEditProduct.html", show: true ,backdrop: 'static'});

        };

        function int() {
            loadPage();
        }
        $scope.reloadContent =function () {
            loadPage();
        };
        $scope.loadNextPage = function (id) {
            loadPage(id);
        };

        $scope.pageNavigation = function (type) {
            if (type === "prev") {
                $scope.productDetails.page = $scope.productDetails.page - 1;
                loadPage($scope.productDetails.page);
            }
            else {
                $scope.productDetails.page = $scope.productDetails.page + 1;
                loadPage($scope.productDetails.page);
            }
        };
        int();
    }]);
