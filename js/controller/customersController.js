app.controller('customersController', ['$scope', '$modal', 'CommonService',  'HttpService',
    function ($scope, $modal, CommonService,  HttpService) {


        $scope.customer = {};
        $scope.customer.account = {};
        $scope.customer.customerList=[];
        $scope.customer.page = 0;
        $scope.pageSize = 20;

        
        function managePagination(customer) {
            $scope.customer.customerList = customer.content;
            $scope.customer.totalPages = customer.totalPages;
            $scope.customer.isFirstPage = customer.first;
            $scope.customer.isLastPage = customer.last;
            $scope.customer.page = customer.number;
            $scope.customer.pagination = [];
            if ($scope.customer.totalPages > 1) {
                $scope.customer.pagination = CommonService.generatePagination($scope.customer.totalPages, $scope.customer.page);
            }
            $scope.customer.limitStart = CommonService.checkLimitStart($scope.customer.page, $scope.customer.pagination.length);
        }

        function loadPage(pageNo) {
            HttpService.getAllCustomer({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, {},function (response) {
                $scope.customer.customerList = response;
                managePagination(response);
            })
        }

     

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
                $scope.customer.page = $scope.customer.page - 1;
                loadPage($scope.customer.page);
            }
            else {
                $scope.customer.page = $scope.customer.page + 1;
                loadPage($scope.customer.page);
            }
        };
       
        int();
       
}]);
