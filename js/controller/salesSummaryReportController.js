app.controller('salesSummaryReportController', ['$scope', '$http','$rootScope','$modal','host','CommonService', 
    function ($scope, $http, $rootScope, $modal,host,CommonService) {

        $scope.filterOption = {};
        $scope.isInValidSearch=false;
        
        $scope.downloadRep=function(){

            if($scope.filterOption.fromDate && $scope.filterOption.toDate){
                jQuery.ajax({
                     url: '/',
                     data: {},
                     success: function(){
                        window.open(host.get() +$rootScope.reportPort+'/ebuy-reporting-api/report/getSalesSummaryReport?fromDate='+$scope.filterOption.fromDate+'&toDate='+$scope.filterOption.toDate);
                     },
                     async: false
                });
                $scope.isInValidSearch =false;
            }else
                $scope.isInValidSearch =true;  
    
        }


}]);
