app.controller('dashboardController', ['$scope', '$timeout', '$rootScope', 'localStorageService', function ($scope, $timeout, $rootScope, localStorageService) {


    $rootScope.loginUserName = localStorageService.get("user_fname") + " " + localStorageService.get("user_lname");

    $scope.labels = ["Incoming", "Outgoing"];
    $scope.data = [300, 500];
    $scope.doughnut_colors = ['#46BFBD', '#DCDCDC'];

    //operator lable list
    $scope.bar_labels = [];

        $scope.subscriberData = {
            "totSubscribersOpwise": [
                {
                    "activeCount": 8,
                    "onlineCount": 3,
                    "opId": 2,
                    "count": 11,
                    "inactiveCount": 3
                },
                {
                    "activeCount": 0,
                    "onlineCount": 0,
                    "opId": 595,
                    "count": 2,
                    "inactiveCount": 2
                },
                {
                    "activeCount": 0,
                    "onlineCount": 0,
                    "opId": 857,
                    "count": 1,
                    "inactiveCount": 1
                }
            ],
            "activeSubscribers": 8,
            "inactiveSubscribers": 6,
            "totalSubscribers": 14,
            "onlineSubscribers": 3
        };

    $scope.subscriberData.chart = {};
    $scope.subscriberData.chart.labels = ["ToyCat1", "ToyCat2","ToyCat3","ToyCat4","ToyCat5","ToyCat6"];
    $scope.subscriberData.chart.data = [];
    $scope.subscriberData.chart.colors = ['#00ADF9', '#949FB1'];
    $scope.subscriberData.chart.data[0] = [100.20,60,10,120,80];
    $scope.subscriberData.chart.data[1] = [20,80,50,40,10,50,70];
    $scope.subscriberData.chart.series = ['In Stock', 'Purchased'];
    $scope.subscriberData.chart.option = {legend: {display: true}};


    //cardPool related statistics info

        $scope.cardData = {
            "usedActiveTotal": 3,
            "totCardsOpwise": [{
                "opWiseTotActCount": 6,
                "waitingActive": 0,
                "opId": 483,
                "usedActive": 1,
                "unUsedActive": 5
            }, {
                "opWiseTotActCount": 62,
                "waitingActive": 1,
                "opId": 2,
                "usedActive": 2,
                "unUsedActive": 55
            }, {
                "opWiseTotActCount": 7,
                "waitingActive": 0,
                "opId": 0,
                "usedActive": 0,
                "unUsedActive": 7
            }, {"opWiseTotActCount": 2, "waitingActive": 0, "opId": 1186, "usedActive": 0, "unUsedActive": 2}],
            "totalCount": 77,
            "unUsedActiveTotal": 69,
            "waitingActiveTotal": 1
        };

    $scope.cardData.chart = {};
    $scope.cardData.chart.labels = $scope.bar_labels;
    $scope.cardData.chart.data = [];
    $scope.cardData.chart.colors = ['#00ADF9', '#949FB1', '#f39c12'];
    $scope.cardData.chart.data[0] = [];
    $scope.cardData.chart.data[1] = [];
    $scope.cardData.chart.data[2] = [];

    $scope.cardData.chart.series = ['Ready', 'Used', 'Pending'];
    $scope.cardData.chart.option = {legend: {display: true}};





}]);
