
app.controller('categoryController', ['$scope', '$modal', 'CommonService', 'dashBoardService', 'HttpService',
    function ($scope, $modal, CommonService, dashBoardService, HttpService) {


        $scope.categorytDetails = {};
        $scope.categorytDetails.productList = [];
        $scope.categorytDetails.page = 0;
        $scope.pageSize = 20;
        $scope.categorytDetails.categoryList = [{
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
        function managePagination(categorytDetails) {
            $scope.categorytDetails.totalPages = categorytDetails.totalPages;
            $scope.categorytDetails.isFirstPage = categorytDetails.first;
            $scope.categorytDetails.isLastPage = categorytDetails.last;
            $scope.categorytDetails.page = categorytDetails.number;
            $scope.categorytDetails.pagination = [];
            if ($scope.categorytDetails.totalPages > 1) {
                $scope.categorytDetails.pagination = categorytDetails.generatePagination($scope.categorytDetails.totalPages, $scope.categorytDetails.page);
            }
            $scope.categorytDetails.limitStart = categorytDetails.checkLimitStart($scope.categorytDetails.page, $scope.categorytDetails.pagination.length);
        }

        function loadPage(pageNo) {
            HttpService.getAllProducts({"page": pageNo, "size": $scope.pageSize, sort:'id'},function (response) {
                $scope.categorytDetails.productList = response;
                managePagination(response);
            })
        }
        var modalAddEdit;
        $scope.productAddEdit  = function (type,value) {
            var productAddEditScope = $scope.$new(true);
            productAddEditScope.type = type;
            productAddEditScope.submitForm = false;

            if(type =="Edit"){
                productAddEditScope.categorytDetails = value;
            }
            else{
                productAddEditScope.categorytDetails = {
                    "name":"",
                    "description":"",
                    "isActive":true
                }
            }
            productAddEditScope.productSubmit =function(){
                if(productAddEditScope.categorytDetails.name){
                    HttpService.saveProduct(productAddEditScope.categorytDetails,function(response){
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
                $scope.categorytDetails.page = $scope.categorytDetails.page - 1;
                loadPage($scope.categorytDetails.page);
            }
            else {
                $scope.categorytDetails.page = $scope.categorytDetails.page + 1;
                loadPage($scope.categorytDetails.page);
            }
        };
        int();
    }]);
