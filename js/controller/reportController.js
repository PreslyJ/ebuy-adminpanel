app.controller('reportController', ['$scope', '$modal', 'CommonService', 'HttpService',
    function ($scope, $modal, CommonService,  HttpService) {


        $scope.filterOption = {};


        $scope.downloadRep=function(){

            if(scope.filterOption.fromDate && scope.filterOption.toDate){
                HttpService.getStockReport({},$scope.filterOption, function (response) {
                });
            }
        }

    }]);
