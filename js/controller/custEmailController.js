app.controller('custEmailController', ['$scope', '$modal','host','CommonService','HttpService',
    function ($scope, $modal,host,CommonService,HttpService) {
        $scope.email = {};
        $scope.msg = "";
        $scope.disabled=false;

        $scope.sendEmail = function () {
            HttpService.sendEmail($scope.msg,function (response) {
                $scope.disabled=true;
            })
        };

    }]);
