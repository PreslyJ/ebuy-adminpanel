app.controller('salesSummaryReportController', ['$scope', '$modal', 'CommonService', 'HttpService',
    function ($scope, $modal, CommonService,  HttpService) {

        $scope.filterOption = {};
        $scope.isInValidSearch=false;

        $scope.downloadRep=function(){
            if($scope.sbsReport.fromDate && $scope.sbsReport.toDate){
                if(scope.filterOption.fromDate && scope.filterOption.toDate){
                    HttpService.getSalesSummaryReport({},$scope.filterOption, function (response) {
                    });
                }
                $scope.isInValidSearch =false;
            }else
                $scope.isInValidSearch =true;  
        }

}]);
