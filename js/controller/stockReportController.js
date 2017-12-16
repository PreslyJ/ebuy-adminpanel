app.controller('stockReportController', ['$scope', '$http','$rootScope','$modal','host','CommonService', 'HttpService', 
    function ($scope, $http, $rootScope, $modal,host,CommonService,HttpService) {

        $scope.filterOption = {};
        $scope.isInValidSearch=false;
        $scope.isDisable=false;    

        $scope.downloadRep=function(){

            if($scope.filterOption.fromDate && $scope.filterOption.toDate){
                jQuery.ajax({
                     url: '/',
                     data: {},
                     success: function(){
                        window.open(host.get() +$rootScope.reportPort+'/ebuy-reporting-api/report/getStockReport?fromDate='+$scope.filterOption.fromDate+'&toDate='+$scope.filterOption.toDate);
                     },
                     async: false
                });
                $scope.isInValidSearch =false;
            }else
                $scope.isInValidSearch =true;  
    
        }

         function load(){

            HttpService.getRep2(function (response) {            
                $scope.isDisable=false;
            }, function(error) {
                $scope.isDisable=true;   
            });

        }

        load();
}]);
