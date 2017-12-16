app.controller('custEmailController', ['$scope', '$modal','host','CommonService','HttpService',
    function ($scope, $modal,host,CommonService,HttpService) {
        $scope.email = {};
        $scope.email.content = "";
        


        $scope.sendEmail = function () {
            HttpService.sendEmail($scope.email.content,function (response) {
                $scope.email.content={};
            })
        };

    }]);
