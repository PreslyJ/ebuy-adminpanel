app.controller('dashboardController', ['$scope','HttpService', function ($scope,HttpService) {

    $scope.labels = ["Incoming", "Outgoing"];
    $scope.data = [300, 500];
    $scope.doughnut_colors = ['#46BFBD', '#DCDCDC'];

    //operator lable list
    $scope.bar_labels = [];

    $scope.subscriberData = {};

    $scope.subscriberData.chart = {};
    $scope.subscriberData.chart.labels = [];
    $scope.subscriberData.chart.data = [];
    $scope.subscriberData.chart.colors = ['#00ADF9', '#949FB1'];
    $scope.subscriberData.chart.data[0] = [];
    $scope.subscriberData.chart.data[1] = [];
    $scope.subscriberData.chart.series = ['In Stock', 'Purchased'];
    $scope.subscriberData.chart.option = {legend: {display: true}};
    $scope.avgViews=255;
    $scope.avgItemPurchases=2;





    function loadPage(pageNo) {
       HttpService.getStockDetails( function (response) {
             var itemNames=[];
             var inStock=[];
             var outStock=[];
             response.content.forEach(function(stk){
                itemNames.push(stk.item);
                inStock.push(stk.stocks);
                outStock.push(stk.purchased);
             });
             $scope.subscriberData.chart.data[0]=inStock;
             $scope.subscriberData.chart.data[1]=outStock;
             $scope.subscriberData.chart.labels=itemNames;
       
            HttpService.getAvgItemPurchases( function (response) {
                 $scope.avgItemPurchases=response.avgItemPurchases;
            });

            HttpService.getAvgViews(function (response) {
                 $scope.avgViews=response.avgViews;
            });
        })

       
    }

    function init() {
        loadPage();
    }

    init();

}]);
