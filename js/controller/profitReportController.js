app.controller('profitReportController', ['$scope', '$modal', 'CommonService', 'HttpService',
    function ($scope, $modal, CommonService,  HttpService) {

        $scope.filterOption = {};
        $scope.isInValidSearch=false; 

        $scope.downloadRep=function(){
            if($scope.filterOption.fromDate && $scope.filterOption.toDate){
                HttpService.getProfitReport($scope.filterOption, function (response) {
                });
                $scope.isInValidSearch =false;
            }
            else
                $scope.isInValidSearch =true;  
        }

}]);
