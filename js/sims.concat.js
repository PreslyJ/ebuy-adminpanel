var app = angular.module("sims", ['ngRoute', 'mgcrea.ngStrap', 'ngResource', 'ngAnimate', 'angular.morris', 'angular-loading-bar', 'ngCookies', 'btford.socket-io', 'angularMoment']);
app.run(['$rootScope', '$route', '$alert', 'socketService', '$window', '$cookieStore', '$location', '$window', function ($rootScope, $route, $alert, socketService, $window, $cookieStore, $location) {

    'use strict';

    socketService.on('feed', function (data) {

        var Alert = {};

        var content = {};

        function JSONParser(valueSet) {
            try {
                return JSON.parse(valueSet);
            } catch (e) {
                return false;
            }
            return true;
        };

        content.message = JSONParser(data).logContent;
        content.time = JSONParser(data).trnDate;
        Alert.content = JSON.stringify(content);
        Alert.type = 'info';
        Alert.title = "Notification\n";


        $alert(Alert);

        if (content.message.search("Online") != -1) {
            $window.location.reload();
        }


    });


    $rootScope.$on('$routeChangeSuccess', function () {
        if ($location.path() !== '/' && !$cookieStore.get('token')) {
            $location.path('/');
        }
        $rootScope.loginUser = $cookieStore.get('loginUser') || '';
        $rootScope.JSONParser = function (valueSet) {
            try {
                return JSON.parse(valueSet);
            } catch (e) {
                return false;
            }
            return true;
        };

        $rootScope.title = $route.current.title;
        $rootScope.notifications = {
            'success': {
                'count': 5,
                'messages': [{
                    'id': 1,
                    'message': 'New Templated has been added',
                    'route': 'template'
                }, {
                    'id': 2,
                    'message': 'New Operator has been added',
                    'route': 'operator'
                }, {
                    'id': 3,
                    'message': 'New Templated has been added'
                }]
            },
            'warning': {
                'count': 4,
                'messages': [{
                    'id': 1,
                    'message': 'This Template has been failed'
                }, {
                    'id': 2,
                    'message': 'New Operator has been added'
                }, {
                    'id': 3,
                    'message': 'New Templated has been added'
                }]
            },
            'danger': {
                'count': 7,
                'messages': [{
                    'id': 1,
                    'message': 'New Templated has been added'
                }, {
                    'id': 2,
                    'message': 'New Operator has been added'
                }, {
                    'id': 3,
                    'message': 'New Templated has been added'
                }]
            }
        };
    });
    $rootScope.menuList = [
        {
            "mainMenu": "Dashboard",
            "route": "#/dashboard",
            "active": true,
            "icon": "fa-dashboard",
            "subMenuActive": false,
            "subMenu": [],
            "originalPath": '/'
        },
        {
            "mainMenu": "Subscriber",
            "route": "#subscriber",
            "active": false,
            "icon": "fa-mobile",
            "subMenuActive": false,
            "subMenu": [],
            "originalPath": '/subscriber'
        },
        {
            "mainMenu": "Template",
            "route": "#template",
            "active": false,
            "icon": "fa-sticky-note-o",
            "subMenuActive": false,
            "subMenu": [],
            "originalPath": '/template'
        },
        {
            "mainMenu": "Log",
            "route": "#log/incoming",
            "active": false,
            "icon": "fa-table",
            "subMenuActive": false,
            "subMenu": [
                {
                    "title": "Incoming",
                    "route": "#log/incoming",
                    "active": true,
                    "originalPath": '/log/incoming'
                },
                {
                    "title": "Outgoing",
                    "route": "#log/outgoing",
                    "active": false,
                    "originalPath": '/log/outgoing'
                }
            ],
            "originalPath": '/log/incoming'
        },
        {
            "mainMenu": "Operator",
            "route": "#operator",
            "active": false,
            "icon": "fa-wifi",
            "subMenu": [],
            "originalPath": '/operator'
        },
        {
            "mainMenu": "Card Pool",
            "route": "#cardpool",
            "active": false,
            "icon": "fa-vcard-o",
            "subMenuActive": false,
            "subMenu": [],
            "originalPath": '/cardpool'
        }

    ];
    $rootScope.clickOnMainMenu = function (index) {
        if ($rootScope.menuList[index].active && $rootScope.menuList[index].subMenuActive) {
            $rootScope.menuList[index].subMenuActive = false;
        }
        else {
            angular.forEach($rootScope.menuList, function (mainMenu) {
                mainMenu.active = false;
                mainMenu.subMenuActive = false;
                angular.forEach(mainMenu.subMenu, function (sub) {
                    sub.active = false;
                });
            });
            $rootScope.menuList[index].active = true;
            $rootScope.menuList[index].subMenuActive = true;
            if ($rootScope.menuList[index].subMenu.length) {
                $rootScope.menuList[index].subMenu[0].active = true;
            }
        }

    };
    $rootScope.clickOnSubMenu = function (subMenu, index) {
        angular.forEach(subMenu, function (sub) {
            sub.active = false;
        });
        subMenu[index].active = true;
    };
    $rootScope.logOut = function () {
        $cookieStore.remove("token");
        $cookieStore.remove("loginUser");
        $location.path('/');
    };

}]);
app.config(['$resourceProvider', '$alertProvider', 'cfpLoadingBarProvider', '$httpProvider', function ($resourceProvider, $alertProvider, cfpLoadingBarProvider, $httpProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.spinnerTemplate = '<div><div id="overlay"><span class="loader"></span></div></div>';
    angular.extend($alertProvider.defaults, {
        animation: 'am-fade-and-slide-top',
        placement: 'top',
        container: "#alerts-container",
        show: true,
        duration: 5,
        templateUrl: "views/alert/alert.tpl.html"
    });
}]);
;app.config(function($routeProvider, $locationProvider) {

//$locationProvider.html5Mode(true);
    $routeProvider
        .when('/dashboard', {
            title: 'Dashboard',
            templateUrl: 'views/index.html',
            controller: 'dashboardController',
            resolve: {
              statistics : function(OperatorService, CountryService,dashBoardService,SubscriberService,CardPoolService ,$q,$timeout){

                    return $q.all([ OperatorService.view().$promise, CountryService.view().$promise ,SubscriberService.view({"page":0,"size":10,sort:'id'}).$promise,CardPoolService.view().$promise]).then( function(result) {

                     return { 'operators_count' : result[0].length, 'countries_count' : result[1].length , 'subscriber_count': result[2].totalElements,'card_count':result[3].length};

              })
            }
          }
        })
        .when('/template', {
            title: 'Template Admin',
            templateUrl: 'views/template/admin.html',
            controller: 'templateController',
            resolve: {
              Templates : function(TemplateService, OperatorService, CountryService, $q, $location){

                    return $q.all([ TemplateService.view({"page":0,"size":10,sort:'id'}).$promise, TemplateService.types().$promise, OperatorService.view().$promise, CountryService.view().$promise ]).then( function(result) {

                      return { 'templateDetails' : result[0] , 'types' : result[1], 'operators' : result[2], 'countries' : result[3] };

              })
            }
          }
        })
        .when('/subscriber', {
            title: 'Subscriber',
            templateUrl: 'views/subscriber/subscriber.html',
            controller: 'subscriberController',
            resolve: {
              Subscribers : function(SubscriberService,CountryService,OperatorService,CardPoolService,$q){
                return $q.all([SubscriberService.view({"page":0,"size":10,sort:'id'}).$promise,CountryService.view().$promise, OperatorService.view().$promise,CardPoolService.getCardType({"page":0,"size":100,sort:'id'}).$promise]).then(function(result){
                  return {'subscriberDetails':result[0],'countries': result[1],'operators' : result[2],'cardTypes': result[3]};
                })

              }
            }
        })
        .when('/log/:logType', {
            title: 'Message Log',
            templateUrl: 'views/log/admin.html',
            controller: 'logController',
            resolve: {
              Logs : function(LogService, TemplateService, OperatorService, CountryService, $q, $location){

                    return $q.all([TemplateService.types().$promise, OperatorService.view().$promise, CountryService.view().$promise ]).then( function(result) {

                      return {  'types' : result[0], 'operators' : result[1], 'countries' : result[2] };

              })
            }
          }
        })
        .when('/delivery-log', {
            title: 'Delivery Log',
            templateUrl: 'views/log/deliveryLog.html',
            controller: 'deliveryLogController',
            resolve: {
              Logs : function(DeliveryLogService, $q, $location){

                    return $q.all([DeliveryLogService.view().$promise]).then( function(result) {

                      return { 'logDetails' : result[0] };

              })
            }
          }
        })
        .when('/template-new', {
            title: 'Template New',
            templateUrl: 'views/template/new.html',
            controller: 'templateNewController',
        })
        .when('/operator-new', {
            title: 'New Operator',
            templateUrl: 'views/operator/new.html',
            controller: 'operatorNewController',
            resolve: {
              Operators : function(CountryService, $q){
                  return $q.all([ CountryService.view().$promise ]).then( function(result) {
                    return { 'countries' : result[0] };
                  })
              }
            }
        })
        .when('/operator', {
            title: 'Operator Admin',
            templateUrl: 'views/operator/admin.html',
            controller: 'operatorController',
            resolve: {
              Operators : function(OperatorService, CountryService, $q){
                  return $q.all([ OperatorService.view().$promise, CountryService.view().$promise ]).then( function(result) {
                    return { 'operators' : result[0],'countries' : result[1] };
                  })
              }
            }
        })
        .when('/operator-edit', {
            title: 'Edit Operator',
            templateUrl: 'views/operator/edit.html',
            controller: 'operatorEditController',
        })
        .when('/crm/:type', {
            title: 'CRM',
            templateUrl: 'views/crm/admin.html',
            controller: 'crmController',
            resolve: {
              Operators : function(OperatorService, CountryService, $q){
                  return $q.all([ OperatorService.view().$promise, CountryService.view().$promise ]).then( function(result) {
                    return { 'operators' : result[0],'countries' : result[1] };
                  })
              }
            }
        })
        .when('/add-new-card', {
            title: 'Add New Card',
            templateUrl: 'views/cardPool/addNewCard.html',
            controller: 'addNewCardController',
            resolve: {
              newCard : function( OperatorService, CountryService,CardPoolService, $q){

                    return $q.all([CountryService.view().$promise , OperatorService.view().$promise,CardPoolService.getCardType().$promise]).then( function(result) {

                      return {  'countries' : result[0],'operators':result[1],'cardTypes':result[2] };
                    })
                }
              }

        })
        .when('/cardpool', {
            title: 'Card Pool',
            templateUrl: 'views/cardPool/cardPool.html',
            controller: 'cardPoolController',
            resolve: {
              cardPool : function( OperatorService, CountryService,CardPoolService, $q){

                    return $q.all([CountryService.view().$promise , OperatorService.view().$promise,CardPoolService.view({"page":0,"size":10,sort:'id'}).$promise,CardPoolService.getCardType({"page":0,"size":100,sort:'id'}).$promise]).then( function(result) {

                      return {  'countries' : result[0],'operators':result[1],'cardList':result[2],'cardTypes':result[3] };
                    })
                }
              }
        })
        .when('/view-card-type', {
            title: 'View Card Type',
            templateUrl: 'views/cardPool/viewCardTypes.html',
            controller: 'viewCardTypesController',
            resolve: {
              cardTypeDetails : function( OperatorService, CountryService,CardPoolService, $q){

                    return $q.all([CountryService.view().$promise , OperatorService.view().$promise,CardPoolService.view().$promise,CardPoolService.getCardType({"page":0,"size":10,sort:'id'}).$promise]).then( function(result) {

                      return {  'countries' : result[0],'operators':result[1],'cardList':result[2],'cardTypes':result[3]  };
                    })
                }
            }
        })
        .when('/', {
            title: 'login',
            templateUrl: 'login/login.html',
            controller: 'loginController',
        })
        // If 404
        .otherwise({
            redirectTo: '/'
        });
});
;app.service('resourceErrorHandler', function($alert) {

var Alert = {};

return function (res){

  Alert.title = res.status.toString();

  if(res.status == 404){

      Alert.content = "{\"message\" : \"Something wrong with the API\"}";
      Alert.type = 'warning';

  }else if(res.status == 405){

      Alert.content = "{\"message\" : \"Method not allowed\"}";
      Alert.type = 'warning';

  }else if(res.status == 403){

      Alert.content ="{\"message\" : \"Forbidden\"}";
      Alert.type = 'warning';

  }else if(res.status == 500){

      Alert.content = "{\"message\" : \"Server Error\"}";
      Alert.type = 'warning';

  }

  $alert(Alert);

}

});
;app.service('resourceSuccessHandler', function($alert) {

var Alert = {};

return function (res){

  Alert.title = res.status.toString();

  if(res.status == 200){

      Alert.content ={};
      Alert.content="{\"message\" : \"Your request has been successful\"}";
      Alert.type = 'success';

  }

  $alert(Alert);
  return res.data;

}

});
;app.service('TemplateService', function($resource, $alert, resourceSuccessHandler, resourceErrorHandler, host) {


    return $resource(host.get() + '/sims-template-api/template/view/:id', {  }, {
        'view':   {method:'GET', interceptor : {responseError : resourceErrorHandler}},
        'findTemplateById': {url :  host.get() +'/sims-template-api/template/findTemplateById/:id', method:'GET', interceptor : { }},
        'viewByFilter':{url : host.get() + '/sims-template-api/template/view', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'save':   {url : host.get() + '/sims-template-api/template/create', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'update':   {url : host.get() + '/sims-template-api/template/update', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'types':  {url :  host.get() + '/sims-template-api/template/types', method:'POST', isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'validate': {url :  host.get() +'/sims-template-api/template/validate', method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'delete': {url :  host.get() +'/sims-template-api/template/delete/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}}
      });
});
;app.service('OperatorService', function($resource, $alert, resourceErrorHandler, host ,resourceSuccessHandler) {

    return $resource(host.get() + '/sims-operator-api/operator/view:id', {}, {
        'view':    {method:'GET', isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'save':   {url : host.get() + '/sims-operator-api/operator/create', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'query':  {method:'GET', isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'remove': {method:'DELETE', interceptor : {responseError : resourceErrorHandler}},
        'delete': {url :  host.get() +'/sims-operator-api/operator/delete/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}}
      });
});
;app.service('CountryService', function($resource, $alert, resourceErrorHandler, host) {

    return $resource(host.get() +'/sims-operator-api/country/view/:id', {}, {
        'view':   {method:'GET', isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'save':   {url : host.get() +'template/create', method:'POST', isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'types':  {url : host.get() +'template/types', method:'POST', isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'remove': {method:'DELETE', interceptor : {responseError : resourceErrorHandler}},
        'delete': {method:'DELETE', interceptor : {responseError : resourceErrorHandler}}
      });
});
;app.service('LogService', function($resource, $alert, resourceSuccessHandler, resourceErrorHandler, host) {

    return $resource(host.get() +'/sims-log-api/log/viewSms', {}, {
      'view':   {method:'GET', interceptor : {responseError : resourceErrorHandler}},
      'viewByFilter':{url : host.get() + '/sims-template-api/smslog/view', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
      'save':   {url : host.get() + '/sims-template-api/template/create', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
      'update':   {url : host.get() + '/sims-template-api/template/update', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
      'delete': {url :  host.get() +'/sims-template-api/template/delete', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
      'outgoingLog':{url : host.get() + '/sims-log-api/log/view', method:'GET',  interceptor : {responseError : resourceErrorHandler}}

      });
});
;app.factory('socketService', function(socketFactory, $rootScope) {

      var socket = io.connect('http://lk.techleadintl.com:3001');
      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        }
      };
});
;app.service('host', function() {

  var url = "http://lk.techleadintl.com:8086";
  return {

    'get' : function(){
        return url;
    }
  }
});
;app.service('SubscriberService', function($resource, $alert, resourceErrorHandler, resourceSuccessHandler, host) {

    return $resource(host.get()+'/sims-subscriber-api/subscriber/view/:id', {}, {
        'view':  {method:'GET', interceptor : {responseError : resourceErrorHandler}},
        'findSubscriberById':{url : host.get() + '/sims-subscriber-api/subscriber/findSubscriberById/:id', method:'GET', interceptor : {}},
        'viewByFilter':{url : host.get() + '/sims-subscriber-api/subscriber/search', method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'sendCard':{url : host.get() + '/sims-subscriber-api/subscriber/sendCard', method:'POST', isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'query':{url : host.get() + '/sims-subscriber-api/subscriber/querySubscriber',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'save':{url : host.get() + '/sims-subscriber-api/subscriber/create',method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'update':{url : host.get() + '/sims-subscriber-api/subscriber/update',method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'delete': {url :  host.get() +'/sims-subscriber-api/subscriber/delete/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getAllocatedPackages':{url :  host.get() +'/sims-subscriber-api/subscriber/getAvailablePackagesForUser', method:'POST', isArray:true, interceptor : { responseError : resourceErrorHandler}},
        'reserveCard':{url : host.get() +'/sims-subscriber-api/subscriber/reserveCardForUser',method:'POST', interceptor : { responseError : resourceErrorHandler}},
        'cancelTransaction':{url :  host.get() +'/sims-subscriber-api/subscriber/cancelTransaction/:id', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'sendCard':{url :  host.get() +'/sims-subscriber-api/subscriber/confirmTransaction', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}}
      });
});

;app.service('CardPoolService', function($resource, $alert,resourceSuccessHandler, resourceErrorHandler,host) {

    return $resource(host.get()+'/sims-cardpool-service/card/:active', {}, {
        'view':  {url :host.get()+ '/sims-cardpool-service/card/viewActive',method:'GET', interceptor : {responseError : resourceErrorHandler}},
        'getCardDetail':{url : host.get() + ':id/', method:'POST', isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'addNewCard':{url : host.get() + '/sims-cardpool-service/card/create', method:'POST',  interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'updateCard':{url : host.get() + '/sims-cardpool-service/card/update', method:'POST',  interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deleteCard': {url :host.get() +'/sims-cardpool-service/card/delete/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'addCardType':{url :host.get() + '/sims-cardpool-service/cardType/create', method:'POST',  interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getCardType':{url :host.get() + '/sims-cardpool-service/cardType/viewActive', method:'GET',  interceptor : { responseError : resourceErrorHandler}},
        'deleteCardType': {url :host.get() +'/sims-cardpool-service/cardType/delete/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'updateCardType':{url : host.get() + '/sims-cardpool-service/cardType/update', method:'POST',  interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}}
      });
});
;app.service('dashBoardService', function($resource, $alert, resourceSuccessHandler, resourceErrorHandler, host) {

    return $resource(host.get() + '/dashboard/view', {  }, {
        'view':   {method:'GET', interceptor : {responseError : resourceErrorHandler}}
      });
      
});
;app.service('PaginationService', function () {
    /*
     * Generate Pagination
     * */

    this.generatePagination = function (totalPages, page) {
        var pagination = [];
        for (var i = 0; i < totalPages; i++) {
            pagination.push({"id": i, active: false});
        }
        pagination[page].active = true;
        return pagination;
    };

    //handle pagination start position
    this.checkLimitStart = function (page, length) {
        var limitStart = 0;
        var limit = 10;
        if (limit < length) {
            var end = page + limit - 1;
            if (length <= end) {
                var diff = end - length;
                limitStart = end - limit -diff;

            }
        }
        return limitStart;

    };

});;app.service('CrmService', function($resource, $alert, resourceSuccessHandler, resourceErrorHandler, host) {


    return $resource(host.get() + '/sims-template-api/template/view/:id', {  }, {
        'view':   {method:'GET', interceptor : {responseError : resourceErrorHandler}}
    });
});
;app.controller('dashboardController', ['$scope', 'statistics', '$timeout', function ($scope, statistics, $timeout) {

    $scope.statistics = statistics;
    $scope.incomingMessage = [
        {label: "Success", value: 125},
        {label: "Fail", value: 23}
    ];
    $scope.outgoingMessage = [
        {label: "Success", value: 225},
        {label: "Fail", value: 20}
    ];
    $scope.operatorWiseSubscriber = [
        {y: "SMART", a: 5, b: 100},
        {y: "CUGSM", a: 10, b: 65},
        {y: "MOBITEL", a: 8, b: 80},
        {y: "HUTCH", a: 75, b: 65}
    ];


    $timeout(function () {
        $("#bar_chart").empty();
        $("#bar_chart_card").empty();
        $("#donut_incoming").empty();
        $("#donut_outgoing").empty();
        Morris.Area({
            element: 'bar_chart',
            data: [
                {y: 'Smart', a: 100, b: 90},
                {y: 'Metfone', a: 75, b: 65},
                {y: 'cellcard', a: 50, b: 40},
                {y: 'seatel', a: 75, b: 65},
                {y: 'qb', a: 50, b: 40},
                {y: 'Mobitel', a: 50, b: 95}
            ],
            xkey: 'y',
            ykeys: ['a', 'b'],
            parseTime: false,
            labels: ["Active", "Inactive"],
            lineColors: ["#31C0BE", "#c7254e"]
        });
        Morris.Bar({
            element: 'bar_chart_card',
            data: [
                {y: 'Smart', a: 100, b: 90},
                {y: 'Metfone', a: 75, b: 65},
                {y: 'cellcard', a: 50, b: 40},
                {y: 'seatel', a: 75, b: 65},
                {y: 'qb', a: 50, b: 40},
                {y: 'Mobitel', a: 75, b: 65}
            ],
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Series A', 'Series B']
        });
        Morris.Donut({
            element: 'donut_incoming',
            data: [
                {label: "Success", value: 125},
                {label: "Fail", value: 23}
            ]
        });
        Morris.Donut({
            element: 'donut_outgoing',
            data: [
                {label: "Success", value: 225},
                {label: "Fail", value: 20}
            ]
        });
    }, 1);
}]);
;app.controller('templateController', ['$scope', '$modal', 'TemplateService', 'Templates', '$location', 'PaginationService',
    function ($scope, $modal, TemplateService, Templates, $location, PaginationService) {


        $scope.pageSize = 10;
        $scope.pagination = [];
        $scope.tableHeight = 400;
        $scope.eventList = [
            {"id":1,"value":"Send Balance Request"},
            {"id":2,"value":"Send Reload Request"},
            {"id":3,"value":"Send System Notification"},
            {"id":4,"value":"Send Data Balance Request"}
        ];
        change_size();
        function change_size() {
            $scope.tableHeight = $(window).height() - 180 - $(".table-scroll").height();
        }

        function managePagination(templateDetails) {
            $scope.templates = templateDetails.content;
            $scope.totalPages = templateDetails.totalPages;
            $scope.isFirstPage = templateDetails.first;
            $scope.isLastPage = templateDetails.last;
            $scope.page = templateDetails.number;
            $scope.pagination = [];
            if ($scope.totalPages > 1) {
                $scope.pagination = PaginationService.generatePagination($scope.totalPages, $scope.page);
            }
            $scope.limitStart = PaginationService.checkLimitStart($scope.page, $scope.pagination.length);
        }

        if (typeof Templates.templateDetails !== 'undefined') {
            managePagination(Templates.templateDetails);
        } else {
            return;
        }
        function manageTemplateTypes(templateTypes) {
            angular.forEach(templateTypes,function (template) {
                if(template.type.indexOf("request") >-1){
                    template.isRequest = true;
                }
                else{
                    template.isRequest = false;
                }

            });

            return templateTypes;

        }
        if (typeof Templates.types !== 'undefined') {
            $scope.types = manageTemplateTypes(Templates.types);
        } else {
            return;
        }

        if (typeof Templates.countries !== 'undefined') {
            $scope.countries = Templates.countries;
        } else {
            return;
        }

        $scope.mncs = [], $scope.mccs = [];

        // handle mnc, mcc duplicate values
        function checkArrayExists(id, dataArray) {
            var isExists = false;
            for (var i = 0; i < dataArray.length; i++) {
                if (dataArray[i] === id) {
                    isExists = true;
                    break;
                }
            }
            return isExists;
        }

        for (var i = 0; i < Templates.operators.length; i++) {
            if (!checkArrayExists(Templates.operators[i].mnc, $scope.mncs)) {
                $scope.mncs.push(Templates.operators[i].mnc);
            }
            if (!checkArrayExists(Templates.operators[i].mcc, $scope.mccs)) {
                $scope.mccs.push(Templates.operators[i].mcc);
            }
        }

        function FilterOption() {
            this.mcc = "";
            this.mnc = "";
            this.country = "";
            this.templateType = "";
        }

        $scope.filterOption = new FilterOption();

        $scope.selectMNC = function (bla) {


        };
        $scope.selectFilterOption = function () {
            //remove when backend ready
            /*TemplateService.viewByFilter({"page":0,"size":10,sort:'id'},$scope.filterOption, function(response){
             managePagination(response);
             });
             */
        };

        $scope.selectCountry = function (id) {
            $scope.mncs = [];
            $scope.mccs = [];

            for (var i = 0; i < Templates.operators.length; i++) {
                if (id == Templates.operators[i].country.id) {
                    if (!checkArrayExists(Templates.operators[i].mnc, $scope.mncs)) {
                        $scope.mncs.push(Templates.operators[i].mnc);
                    }
                    if (!checkArrayExists(Templates.operators[i].mcc, $scope.mccs)) {
                        $scope.mccs.push(Templates.operators[i].mcc);
                    }
                }
            }
        };


        function editTemplate(template) {

            var editTemplateScope = $scope.$new(true); //created isolated scope to the edit view

            editTemplateScope.templateEdit = angular.copy(template);
            editTemplateScope.templateEdit.isValidTemplate = false;
            editTemplateScope.countries = Templates.countries;
            editTemplateScope.operators = Templates.operators;
            editTemplateScope.types = Templates.types;
            editTemplateScope.templateEdit.method = template.method ||'SMS';
            editTemplateScope.submitted = false;
            editTemplateScope.submitValidation = false;
            editTemplateScope.selectedEvent='';
            editTemplateScope.templateEdit.events=[];
            editTemplateScope.eventList = angular.copy($scope.eventList);
            editTemplateScope.templateEdit.templateType.isRequest = _.find()
            var operators = [];

            editTemplateScope.selectCountry = function (id) {
                operators = [];
                for (var i = 0; i < Templates.operators.length; i++) {
                    if (id == Templates.operators[i].country.id) {
                        operators.push(Templates.operators[i]);
                    }
                }
                editTemplateScope.operators = operators;

            };

            editTemplateScope.editTemplateSubmit = function (templateAfterEdit) {
                editTemplateScope.submitted = true;
                if (templateAfterEdit.operator && templateAfterEdit.templateType) {
                    TemplateService.update(templateAfterEdit, function (response) {
                        angular.merge(template, response);
                        modalEdit.$promise.then(modalEdit.hide);

                    });
                }

            };


            editTemplateScope.$watch('templateEdit.templateText', function (oldVal, newVal) {

                editTemplateScope.templateEdit.isValidTemplate = false;

            });

            editTemplateScope.validate = function (template, sample) {
                editTemplateScope.submitValidation = true;
                if (template && sample) {
                    TemplateService.validate({'template': template, 'sample': sample}, function (response) {

                        editTemplateScope.templateEdit.isValidTemplate = response.status;

                    });
                }


            };
            editTemplateScope.setTempType = function (templateType) {
                var temp = templateType.split(' ');
                editTemplateScope.templateType = temp[1];
                //editTemplateScope.templateNew.events=[];
                editTemplateScope.templateNew.method = 'SMS';
                editTemplateScope.templateNew.destination='';
                editTemplateScope.eventList = angular.copy($scope.eventList);

            };
            editTemplateScope.setEvent= function (event) {
                /*if(editTemplateScope.templateNew.events.indexOf(event)>-1){
                    editTemplateScope.templateNew.events.splice(editTemplateScope.templateNew.events.indexOf(event), 1);
                }
                else{
                    editTemplateScope.templateNew.events.push(event);
                }*/

            };

            modalEdit = $modal({scope: editTemplateScope, templateUrl: "views/template/edit.html", show: true});

        }

        var newTemplateScope, modal, modalEdit;
        $scope.templateEdit = function (template) {
            editTemplate(template);
        };


        function templateNew() {

            newTemplateScope = $scope.$new(true);
            newTemplateScope.templateNew = {};
            newTemplateScope.templateNew.isValidTemplate = false;
            newTemplateScope.templateNew.template_patten = /\(\?\<(.*?)\>/;
            newTemplateScope.templateNew.method = 'SMS';
            newTemplateScope.templateType = '';
            newTemplateScope.selectedEvent='';
            //newTemplateScope.templateNew.events=[];
            newTemplateScope.countries = Templates.countries;
            newTemplateScope.operators = Templates.operators;
            newTemplateScope.types = Templates.types;
            newTemplateScope.eventList = angular.copy($scope.eventList);
            newTemplateScope.submitted = false;
            newTemplateScope.submitValidation = false;

            var operators = [];

            newTemplateScope.selectCountry = function (id) {
                operators = [];
                for (var i = 0; i < Templates.operators.length; i++) {
                    if (id == Templates.operators[i].country.id) {
                        operators.push(Templates.operators[i]);
                    }
                }
                newTemplateScope.operators = operators;

            };
            newTemplateScope.selectMethod = function (isSMS) {
                newTemplateScope.templateNew.isSMS=isSMS;
            };
            newTemplateScope.newTemplateSubmit = function (templateNew) {
                newTemplateScope.submitted = true;
                if (newTemplateScope.templateNew.operator && templateNew.templateType) {
                    TemplateService.save(templateNew, function (response) {
                        loadPage($scope.totalPages - 1);
                        //  $scope.templates.push(response);
                        modal.$promise.then(modal.hide);

                    });
                }
            };
            newTemplateScope.setTempType = function (templateType) {
                var temp = templateType.split(' ');
                newTemplateScope.templateType = temp[1];
                //newTemplateScope.templateNew.events=[];
                newTemplateScope.templateNew.method = 'SMS';
                newTemplateScope.templateNew.destination='';
                newTemplateScope.eventList = angular.copy($scope.eventList);

            };
            newTemplateScope.validate = function (template, sample) {
                newTemplateScope.submitValidation = true;
                if (template && sample) {
                    TemplateService.validate({'template': template, 'sample': sample}, function (response) {

                        newTemplateScope.templateNew.isValidTemplate = response.status;

                    });
                }


            };

            newTemplateScope.templateNew.groups = [];
            var myRegexp = /\(\?\<(.*?)\>/mg;

            newTemplateScope.$watch('templateNew.template', function (newVal, oldVal) {

                var match = myRegexp.exec(newVal);
                if (match) {
                    newTemplateScope.templateNew.groups.push(match[1]);
                }

            }, true);

            newTemplateScope.setEvent= function (event) {
               /* if(newTemplateScope.templateNew.events.indexOf(event)>-1){
                    newTemplateScope.templateNew.events.splice(newTemplateScope.templateNew.events.indexOf(event), 1);
                }
                else{
                    newTemplateScope.templateNew.events.push(event);
                }*/

            };

            modal = $modal({scope: newTemplateScope, templateUrl: "views/template/new.html", show: true});

        }

        $scope.newTemplate = function () {
            templateNew();
        };
        if ($location.search().id && $location.search().id !== '0') {
            var template;
            TemplateService.findTemplateById({'id': $location.search().id}, function (response) {
                template = response;
                editTemplate(template);
            });

        }
        else if ($location.search().id && $location.search().id === '0') {
            templateNew();
        }
        $scope.templateDelete = function (template) {

            TemplateService.delete({'id': template.id}, function () {
                loadPage($scope.page);
                //$scope.templates.splice($scope.templates.indexOf(template), 1);
            });

        };

        function loadPage(pageNo) {

            TemplateService.view({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
                managePagination(response);
            });
        }

        $scope.loadNextPage = function (id) {
            loadPage(id);
        };

        $scope.pageNavigation = function (type) {
            if (type === "prev") {
                $scope.page = $scope.page - 1;
                loadPage($scope.page);
            }
            else {
                $scope.page = $scope.page + 1;
                loadPage($scope.page);
            }
        };


    }]);
;app.controller('operatorController', ['$scope', '$modal', 'OperatorService', 'Operators',  function($scope, $modal, OperatorService, Operators){

function OperatorAdmin(){

  this.country = "";
  this.operator = "";
  this.apn = "";
  this.mcc = "";
  this.mnc = "";

}

if(typeof Operators.countries !== 'undefined'){
  $scope.countries = Operators.countries;
}else{
  return;
}
if(typeof Operators.operators !== 'undefined'){
  $scope.operators = Operators.operators;
}else{
  return;
}


var modalEdit;
$scope.operatorEdit = function(operator){

  var editOperatorScope  = $scope.$new(true); //created isolated scope to the edit view
  editOperatorScope.operatorEdit  = operator;
  editOperatorScope.countries=Operators.countries;
  editOperatorScope.submitForm =false;

  editOperatorScope.editOperatorSubmit = function(operatorAfterEdit){
    editOperatorScope.submitForm =false;
    if(editOperatorScope.operatorEdit.country.id && editOperatorScope.operatorEdit.operatorName && editOperatorScope.operatorEdit.mnc && editOperatorScope.operatorEdit.mcc ){
      OperatorService.save(operatorAfterEdit, function(){
          modalEdit.$promise.then(modalEdit.hide);
      });
    }


  };

   modalEdit = $modal({scope: editOperatorScope, templateUrl : "views/operator/edit.html", show: true});

};


$scope.operatorDelete = function(operator){

    OperatorService.delete({ 'id' : operator.id } , function(){
        $scope.operators.splice($scope.operators.indexOf(operator), 1);
    });

};


}]);
;app.controller('operatorNewController', ['$scope', 'OperatorService', 'Operators', function($scope, OperatorService, Operators){

  $scope.countries = Operators.countries;
  $scope.submitForm = false;

  $scope.operatorSave = function(operator){
      $scope.submitForm = true;
      if(operator.country.id && operator.operatorName && operator.mnc && operator.mcc ){

        OperatorService.save(operator, function(response){

        });
      }
  };


}]);
;app.controller('logController', ['$scope', 'Logs', 'LogService', '$routeParams','PaginationService', 'SubscriberService', 'TemplateService',
function ($scope, Logs, LogService, $routeParams,PaginationService, SubscriberService, TemplateService) {

    $scope.pageSize = 10;
    $scope.outPageSize = 20;
    $scope.tableHeight =400;
    // define tab panel
    $scope.tabs = [
        {title: 'Incoming', url: 'views/log/smsIncomingLog.html', active: true, type: 'incoming'},
        {title: 'Outgoing', url: 'views/log/smsOutgoingLog.html', active: false, type: 'outgoing'}
    ];

    function getTabIndex(tabType) {
        var index = '';
        for (var i = 0; i < $scope.tabs.length; i++) {
            if ($scope.tabs[i].type === tabType) {
                index = i;
                return index;
            }
        }

    }

        function IncomingFilterOption() {
            this.smsType = "";
            this.country = "";
            this.date = "";
            this.status = "";
        }

        $scope.incommingFilter = new IncomingFilterOption();

        $scope.selectIncomingFilterOption = function () {
            //remove when backend ready
            /*  LogService.viewByFilter({"page":0,"size":10,sort:'id'},$scope.incommingFilter, function(response){
             managePagination(response);
             });*/
        };

        $scope.selectedTab = 0;
        $scope.incoming = {};
        $scope.outgoing = {};
        $scope.incoming.page = 0;
        $scope.outgoing.page = 0;

        // generate pagination
        function managePagination(messageDetails, type) {
            //$scope[type].messageLogs =messageDetails.content;
            $scope[type].isFirstPage = messageDetails.first;
            $scope[type].isLastPage = messageDetails.last;
            $scope[type].page = messageDetails.number;
            $scope[type].totalPages = messageDetails.totalPages;
            $scope[type].pagination = [];
            if ($scope[type].totalPages > 1) {
                $scope[type].pagination = PaginationService.generatePagination($scope[type].totalPages, $scope[type].page);
            }
            $scope[type].limitStart = PaginationService.checkLimitStart($scope[type].page, $scope[type].pagination.length);
        }

        function mapSubscriber() {
            angular.forEach($scope.incoming.messageLogs, function (message) {
                SubscriberService.findSubscriberById({"id": message.subscriberFk}, function (response) {
                    message.subscriber = response;
                });
            });
            angular.forEach($scope.incoming.messageLogs, function (message) {
                TemplateService.findTemplateById({'id' : message.templateFk}, function (response) {
                    message.template = response;
                });
            });
        }

        // load tab content
        function loadContent() {
            if ($scope.tabs[$scope.selectedTab].type === 'incoming') {                                   //message incoming log
                LogService.view({
                    "page": $scope.incoming.page,
                    "size": $scope.pageSize,
                    sort: 'id'
                }, function (response) {
                    $scope.incoming.messageLogs = response.content;
                    mapSubscriber();
                    managePagination(response, 'incoming');
                });
            }
            else if ($scope.tabs[$scope.selectedTab].type === 'outgoing') {

                LogService.outgoingLog({
                    "page": $scope.outgoing.page,
                    "size": $scope.outPageSize,
                    sort: 'logDate'
                }, function (response) {
                    $scope.outgoing.messageLogs = _.groupBy(response.content, 'processId');
                   //delete $scope.outgoing.messageLogs['0'];
                    managePagination(response, 'outgoing');
                });
            }
        }

        if ($routeParams.logType) {
            angular.forEach($scope.tabs, function (tab) {
                tab.active = false;
            });
            var index = getTabIndex($routeParams.logType);
            $scope.tabs[index].active = true;
            $scope.selectedTab = index;
            loadContent();
        }

        if (typeof Logs.types !== 'undefined') {
            $scope.types = Logs.types;
        } else {
            return;
        }

        if (typeof Logs.countries !== 'undefined') {
            $scope.countries = Logs.countries;
        } else {
            return;
        }
        $scope.selectedVlues = 'test';
        $scope.popover = {
            "title": "Values",
            "content": 'test'

        };
        $scope.outGoingPopover = {
            "title": 'Steps',
            "content": 'steps'
        };

        function JSONParser(valueSet) {
            try {
                return JSON.parse(valueSet);
            } catch (e) {
                return false;
            }
            return true;
        };
        $scope.JSONParser = function (valueSet) {
            return JSONParser(valueSet);
        };


        $scope.statusFilter = function (status) {
            $scope.incommingFilter.status = status;
        };

        $scope.showDescription = function (log) {
            $scope.description = log;
            $scope.description_panel = true;
        };

        $scope.selectRecord = function (value) {
            $scope.selectedVlues = value;
        };
        $scope.selectOutGoingRecord = function (step) {
            $scope.selectedOutRecord = step;
        };
        function loadIncomingPage(pageNo) {

            LogService.view({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
                $scope.incoming.messageLogs = response.content;
                mapSubscriber();
                managePagination(response, 'incoming');
            });
        }

        function loadOutgoingPage(pageNo) {
            LogService.outgoingLog({"page": pageNo, "size": $scope.outPageSize, sort: 'logDate'}, function (response) {
                $scope.outgoing.messageLogs = _.groupBy(response.content, 'processId');
               // delete $scope.outgoing.messageLogs['0'];
                managePagination(response, 'outgoing');
            });
        }

        $scope.loadNextPage = function (id, logType) {

            if (logType === 'incoming') {
                loadIncomingPage(id);
            }
            else {
                loadOutgoingPage(id);
            }
        };

        $scope.pageNavigation = function (type, logType) {
            if (type === "prev") {
                $scope[logType].page = $scope[logType].page - 1;
                if (logType === 'incoming') {
                    loadIncomingPage($scope[logType].page);
                }
                else {
                    loadOutgoingPage($scope[logType].page);
                }

            }
            else {
                $scope[logType].page = $scope[logType].page + 1;
                if (logType === 'incoming') {
                    loadIncomingPage($scope[logType].page);
                }
                else {
                    loadOutgoingPage($scope[logType].page);
                }
            }
        };
        $scope.trimMessage = function (message) {
            var text = message;
            if (message && message.length > 30) {
                text = message.substring(0, 30);
            }
            return text;
        };
        $scope.formatDate = function (selectedDate) {
            var date = '';

            return selectedDate;
        };


        $scope.tabClick = function (index) {
            angular.forEach($scope.tabs, function (tab) {
                tab.active = false;
            });
            $scope.selectedTab = index;
            $scope.tabs[index].active = true;
            loadContent()
        };

        changeTableSize();
        function changeTableSize() {
            $scope.tableHeight = $(window).height() - 265;  //215 = filter area height + table header  height
        }

    }]);
;app.controller('loginController', ['$scope', '$http', '$cookieStore', '$location','$rootScope', function ($scope, $http, $cookieStore, $location, $rootScope) {
   // $('.header').hide();
   // $('.left-side ').hide();

    $scope.userName = "";
    $scope.password = "";
    $scope.login_error = false;
    Morris.Donut.prototype.resizeHandler = function() {
        if(document.getElementById(this.el[0].id)){
            this.timeoutId = null;
            this.raphael.setSize(this.el.width(), this.el.height());
            return this.redraw();
        }
    };
    pageNavigation();
    function pageNavigation() {
        if ($cookieStore.get('token')) {
            $location.path('/dashboard');
        }
        else {
            $location.path('/');
        }
    }

    $scope.login = function () {
        $scope.submitted = true;
        if ($scope.password && $scope.password) {
            doLogin();
        }
    };
    function doLogin() {
        var param = {};
        param.userName = $scope.userName;
        param.password = $scope.password;

        var http = {
            method: 'POST',
            url: '/login',
            data: param
        };
        if ($scope.userName === 'admin' && $scope.password === 'admin') {
            $cookieStore.put('token', '1232134124');
            $cookieStore.put('loginUser', $scope.userName);
            $rootScope.loginUser = $scope.userName;
            $location.path('/dashboard');
        }
        /*$http(http)
         .success(function(response){
         if(response.success){
         $cookieStore.put('token',response.token);
         $location.path('/');
         console.log("Success")
         }
         else{
         $scope.login_error = true;
         }

         }).
         error(function (response) {
         $scope.login_error = true;
         console.log("error")
         });*/
    }
}]);
;app.controller('subscriberController', ['$scope', 'SubscriberService', '$modal', 'Subscribers', '$interval', 'PaginationService', '$timeout',
    function ($scope, SubscriberService, $modal, Subscribers, $interval, PaginationService, $timeout) {
        $scope.selectedUser = '';
        $scope.tableHeight = 400;
        $scope.filter = {
            country: '',
            status: ''
        };

        function FilterOption() {
            this.active = "active";
            this.countryId = null;
            this.operatorId =null;
        }

        $scope.filterOption = new FilterOption();

        $scope.pageSize = 10;
        $scope.pagination = [];

        $scope.selectFilterOption = function () {
            SubscriberService.viewByFilter({"page":0,"size":10,sort:'id'},$scope.filterOption, function(response){
                managePagination(response);
            });

        };
        changeTableSize();
        function changeTableSize() {
            $scope.tableHeight = $(window).height() - 200 - $(".table-cus-header").height();
        }

        if (typeof Subscribers.countries !== 'undefined') {
            $scope.countries = Subscribers.countries;
        } else {
            return;
        }
        if (typeof Subscribers.operators !== 'undefined') {
            $scope.operators = angular.copy(Subscribers.operators);
        } else {
            return;
        }
        if (typeof Subscribers.cardTypes !== 'undefined') {
            $scope.cardTypes = Subscribers.cardTypes.content;
        }
        else {
            return;
        }
        function managePagination(subscriberDetails) {
            $scope.subscriberList = subscriberDetails.content;
            $scope.totalPages = subscriberDetails.totalPages;
            $scope.isFirstPage = subscriberDetails.first;
            $scope.isLastPage = subscriberDetails.last;
            $scope.page = subscriberDetails.number;
            $scope.pagination = [];
            if ($scope.totalPages > 1) {
                $scope.pagination = PaginationService.generatePagination($scope.totalPages, $scope.page);
            }
            $scope.limitStart = PaginationService.checkLimitStart($scope.page, $scope.pagination.length);
        }

        if (typeof Subscribers.subscriberDetails !== 'undefined') {
            managePagination(Subscribers.subscriberDetails);
        } else {
            return;
        }

        $scope.selectRecord = function (item) {
            $scope.selectedUser = item;
        };
        function filterCardTypes(operator) {
            var cardArray = [];
            angular.forEach($scope.cardTypes, function (type) {
                if (operator.id === type.networkOperator.id) {
                    cardArray.push(type);
                }
            });
            return cardArray;
        }

        $scope.doReload = function (subscriber) {
            $scope.selectedSubscriber = subscriber;
            var reloadTemplateScope = $scope.$new(true);
            reloadTemplateScope.reloadData = {};
            reloadTemplateScope.selectedCardType = {};
            reloadTemplateScope.selectedCard = {};
            reloadTemplateScope.transaction = {};
            reloadTemplateScope.transaction.transactionNote = "";
            reloadTemplateScope.transaction.transactionId = "";
            reloadTemplateScope.selectedSubscriber = $scope.selectedSubscriber;
            reloadTemplateScope.loadingStart = false;
            //reloadTemplateScope.cardTypes = filterCardTypes(reloadTemplateScope.selectedSubscriber.operator);

            SubscriberService.getAllocatedPackages({'imei': $scope.selectedSubscriber.imei}, function (response) {
                reloadTemplateScope.cardTypes = response;
            });

            reloadTemplateScope.confirmCardType = function () {
                //need to request from backend

                SubscriberService.reserveCard({
                    'imei': $scope.selectedSubscriber.imei,
                    'cardTypeId': reloadTemplateScope.selectedCardType.id
                }, function (response) {
                    reloadTemplateScope.selectedCard = response.card;
                    reloadTemplateScope.transaction.transactionId = response.transactionId;
                });

                /*reloadTemplateScope.loadingStart = true;
                 $timeout(function () {
                 reloadTemplateScope.loadingStart = false;
                 }, 3000);*/

            };
            reloadTemplateScope.selectCardType = function (type) {
                reloadTemplateScope.selectedCardType = type;
            };
            reloadTemplateScope.cancel = function () {

                //need to backend card release call
                /*
                 only send transactionID
                 SubscriberService.cancelTransaction({'transactionId': reloadTemplateScope.transactionId}, function () {
                 angular.element('.modal').trigger('click')
                 });
                 */

                angular.element('.modal').trigger('click');
                reloadTemplateScope.selectedCardType = "";
                reloadTemplateScope.selectedCard = {};
                reloadTemplateScope.transactionNote = "";
            };
            reloadTemplateScope.reload = function () {


                // only send transactionID
                SubscriberService.sendCard(reloadTemplateScope.transaction, function () {
                    angular.element('.modal').trigger('click');

                });

                angular.element('.modal').trigger('click')
            };

            var modal = $modal({scope: reloadTemplateScope, templateUrl: "views/subscriber/reload.html", show: true});

        };

        $scope.selectCountry = function (id) {
            var operators = [];
            $scope.operators= angular.copy(Subscribers.operators);
            for (var i = 0; i < $scope.operators.length; i++) {
                if (id == $scope.operators[i].country.id) {
                    operators.push($scope.operators[i]);
                }
            }
            $scope.operators = operators;
        };

        $scope.selectOperator = function (id) {
            var operator  = _.find($scope.operators,{'id':id});
            $scope.filterOption.countryId = operator.country.id;
        };
        function loadPage(pageNo) {
            SubscriberService.view({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
                managePagination(response);
            });
        }

        $scope.loadNextPage = function (id) {
            loadPage(id);
        };

        $scope.pageNavigation = function (type) {
            if (type === "prev") {
                $scope.page = $scope.page - 1;
                loadPage($scope.page);
            }
            else {
                $scope.page = $scope.page + 1;
                loadPage($scope.page);
            }
        };

        $scope.querySubscriber = function (subscriber) {
            SubscriberService.query(subscriber, function (response) {

            });
        };

        $scope.editSubscriber = function (selectedItem) {

            var editSubscriberScope = $scope.$new(true);
            editSubscriberScope.selectedItem = angular.copy(selectedItem);
            editSubscriberScope.countries = $scope.countries;
            editSubscriberScope.operators = $scope.operators;
            editSubscriberScope.cardTypes = $scope.cardTypes;
            editSubscriberScope.submitForm = false;
            editSubscriberScope.type = "Edit";
            editSubscriberScope.close = function () {
                angular.element('.modal').trigger('click')
            };
            editSubscriberScope.editSubscriber = function () {
                editSubscriberScope.submitForm = true;
                if (editSubscriberScope.selectedItem.operator && editSubscriberScope.selectedItem.imei) {
                    SubscriberService.update(editSubscriberScope.selectedItem, function (result) {
                        loadPage($scope.page);
                        angular.element('.modal').trigger('click');
                    });
                }

            };
            editSubscriberScope.selectCountry = function (country) {
                var operators = [];
                for (var i = 0; i < editSubscriberScope.operators.length; i++) {
                    if (country.id === editSubscriberScope.operators[i].country.id) {
                        operators.push(editSubscriberScope.operators[i]);
                    }
                }
                editSubscriberScope.operators = operators;
            };
            var modal = $modal({
                scope: editSubscriberScope,
                templateUrl: "views/subscriber/addEditSubscriber.html",
                show: true
            });
        };
        $scope.addSubscriber = function () {
            var addSubscriberScope = $scope.$new(true);
            addSubscriberScope.selectedItem = {};
            addSubscriberScope.selectedItem.operator = {country: {id: ''}};
            addSubscriberScope.countries = $scope.countries;
            addSubscriberScope.operators = $scope.operators;
            addSubscriberScope.cardTypes = $scope.cardTypes;
            addSubscriberScope.submitForm = false;
            addSubscriberScope.type = "Add";
            addSubscriberScope.close = function () {
                angular.element('.modal').trigger('click')
            };
            addSubscriberScope.editSubscriber = function () {
                SubscriberService.update(addSubscriberScope.selectedItem, function (result) {
                    loadPage($scope.page);
                    angular.element('.modal').trigger('click');
                });
            };
            addSubscriberScope.addSubscriber = function () {
                addSubscriberScope.submitForm = true;
                if (addSubscriberScope.selectedItem.operator && addSubscriberScope.selectedItem.imei) {
                    SubscriberService.save(addSubscriberScope.selectedItem, function (result) {
                        loadPage($scope.page);
                        angular.element('.modal').trigger('click');
                    });
                }

            };
            addSubscriberScope.selectCountry = function (country) {
                var operators = [];
                for (var i = 0; i < addSubscriberScope.operators.length; i++) {
                    if (country.id === addSubscriberScope.operators[i].country.id) {
                        operators.push(addSubscriberScope.operators[i]);
                    }
                }
                addSubscriberScope.operators = operators;
            };
            var modal = $modal({
                scope: addSubscriberScope,
                templateUrl: "views/subscriber/addEditSubscriber.html",
                show: true
            });
        };
        $scope.selectSubscriber = function (subscriber) {
            $scope.selectedSubscriber = subscriber;
            angular.forEach($scope.subscriberList,function (subscribe) {
                if(subscribe.trActive != undefined ){
                    subscribe.trActive = false;
                }else{
                    subscribe.trActive = false;
                }

            });
            subscriber.trActive = true;

        };

        $scope.confirmUnregister = function () {
            SubscriberService.delete({'id': $scope.selectedSubscriber.id}, function () {
                loadPage($scope.page);
                //$scope.templates.splice($scope.templates.indexOf(template), 1);
            });
        };
    }]);
;app.controller('cardPoolController', ['$scope', 'CardPoolService', 'PaginationService', '$modal', 'cardPool', function ($scope, CardPoolService, PaginationService, $modal, cardPool) {

    $scope.pageSize =10;
    $scope.page = 0;
    if (typeof cardPool.countries !== 'undefined') {
        $scope.countries = cardPool.countries;
    } else {
        return;
    }
    if (typeof cardPool.operators !== 'undefined') {
        $scope.operators = cardPool.operators;
    } else {
        return;
    }
    if (typeof cardPool.cardTypes !== 'undefined') {
        $scope.cardTypes = cardPool.cardTypes.content;
    } else {
        return;
    }
    $scope.pagination = [];
    $scope.tableHeight = 400;
    change_size();
    function change_size() {
        $scope.tableHeight = $(window).height() - 225 - $(".table-scroll").height();
    }
    function managePagination(cardDetails) {
        $scope.cardList = cardDetails.content;
        $scope.totalPages = cardDetails.totalPages;
        $scope.isFirstPage = cardDetails.first;
        $scope.isLastPage = cardDetails.last;
        $scope.page = cardDetails.number;
        $scope.pagination = [];
        if ($scope.totalPages > 1) {
            $scope.pagination = PaginationService.generatePagination($scope.totalPages, $scope.page);
        }
        $scope.limitStart = PaginationService.checkLimitStart($scope.page, $scope.pagination.length);
    }
    if (typeof cardPool.cardList !== 'undefined') {
        $scope.cardList = cardPool.cardList.content;
        managePagination(cardPool.cardList)
    } else {
        return;
    }
    $scope.filter = {
        country: '',
        operator: ''
    };
    $scope.viewCardDetails = function (cardType) {
        var viewCardScope = $scope.$new(true);
        viewCardScope.cardTypes = $scope.cardTypes;
        viewCardScope.selectedCardType = cardType;
        viewCardScope.close = function () {
            angular.element('.modal').trigger('click')
        };

        var modal = $modal({scope: viewCardScope, templateUrl: "views/cardPool/cardDetails.html", show: true});
    };

    $scope.deleteCard = function (card) {
        CardPoolService.deleteCard({'id': card.id}, function () {
            $scope.cardList.splice($scope.cardList.indexOf(card), 1);
        });
    };
    $scope.editCard = function (card) {
        var editCardScope = $scope.$new(true);
        editCardScope.selectedCard = card;
        editCardScope.countries = $scope.countries;
        editCardScope.operators = $scope.operators;
        editCardScope.cardTypes = $scope.cardTypes;
        editCardScope.submitForm = false;
        editCardScope.type = "Edit";
        editCardScope.close = function () {
            angular.element('.modal').trigger('click')
        };
        editCardScope.editCardDetails = function (cardDetails) {
            editCardScope.submitForm = true;
            if (editCardScope.selectedCard.cardType && editCardScope.selectedCard.serialNumber) {
                CardPoolService.updateCard(cardDetails, function (result) {
                    angular.element('.modal').trigger('click');
                });
            }

        };
        function filterOperators(country){
            var operators = [];
            editCardScope.operators = $scope.operators;
            for (var i = 0; i < editCardScope.operators.length; i++) {
                if (country.id === editCardScope.operators[i].country.id) {
                    operators.push(editCardScope.operators[i]);
                }
            }
            editCardScope.operators = operators;
        }

        editCardScope.selectCountry = function (country) {
            filterOperators(country)
        };
        function filterCardTypes(operator){
            var cardTypes = [];
            editCardScope.cardTypes = $scope.cardTypes;
            for (var i = 0; i < editCardScope.cardTypes.length; i++) {
                if (operator.id === editCardScope.cardTypes[i].networkOperator.id) {
                    cardTypes.push(editCardScope.cardTypes[i]);
                }
            }
            editCardScope.cardTypes = cardTypes;
        }
        if(editCardScope.selectedCard.cardType.networkOperator.country){
            filterOperators(editCardScope.selectedCard.cardType.networkOperator.country);
            filterCardTypes(editCardScope.selectedCard.cardType.networkOperator);
        }
        editCardScope.selectOperator = function (operator) {
            filterCardTypes(operator)
        };

        var modal = $modal({scope: editCardScope, templateUrl: "views/cardPool/addEditCard.html", show: true});
    };
    $scope.addCard = function (card) {
        function cardDTO() {
            var cardDetails = {
                serialNumber: '',
                cardType: ''
            };
            return cardDetails;
        }

        var addCardScope = $scope.$new(true);
        addCardScope.selectedCard = cardDTO();
        addCardScope.countries = $scope.countries;
        addCardScope.operators = $scope.operators;
        addCardScope.cardTypes = $scope.cardTypes;
        addCardScope.submitForm = false;
        addCardScope.type = "Add";
        addCardScope.close = function () {
            angular.element('.modal').trigger('click')
        };
        addCardScope.addCardDetails = function (cardDetails) {
            addCardScope.submitForm = true;
            if (addCardScope.selectedCard.cardType && addCardScope.selectedCard.serialNumber) {
                CardPoolService.addNewCard(cardDetails, function (result) {
                    loadPage(0);
                    //  $scope.cardList.push(result)
                    angular.element('.modal').trigger('click');
                });
            }

        };
        addCardScope.selectCountry = function (country) {
            var operators = [];
            addCardScope.operators = $scope.operators;
            for (var i = 0; i < addCardScope.operators.length; i++) {
                if (country.id === addCardScope.operators[i].country.id) {
                    operators.push(addCardScope.operators[i]);
                }
            }
            addCardScope.operators = operators;
        };
        addCardScope.selectOperator = function (operator) {
            var cardTypes = [];
            addCardScope.cardTypes = $scope.cardTypes;
            for (var i = 0; i < addCardScope.cardTypes.length; i++) {
                if (operator.id === addCardScope.cardTypes[i].networkOperator.id) {
                    cardTypes.push(addCardScope.cardTypes[i]);
                }
            }
            addCardScope.cardTypes = cardTypes;
        };
        var modal = $modal({scope: addCardScope, templateUrl: "views/cardPool/addEditCard.html", show: true});




    };
    function loadPage(pageNo) {
        CardPoolService.view({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
            managePagination(response);
        });
    }
    $scope.loadNextPage = function (id) {
        loadPage(id);
    };

    $scope.pageNavigation = function (type) {
        if (type === "prev") {
            $scope.page = $scope.page - 1;
            loadPage($scope.page);
        }
        else {
            $scope.page = $scope.page + 1;
            loadPage($scope.page);
        }
    };

}]);
;app.controller('addNewCardController', ['$scope','newCard','CardPoolService', function($scope,newCard,CardPoolService){

  $scope.cardDetails  = {
    country:'',
    operator:'',
    serialNumber:'',
    cardType:'',
    serialNo:''
  };
  if(typeof newCard.countries !== 'undefined'){
    $scope.countries = newCard.countries;
  }else{
    return;
  }
  if(typeof newCard.cardTypes !== 'undefined'){
    $scope.operators = newCard.operators;
  }else{
    return;
  }
  if(typeof newCard.cardTypes !== 'undefined'){
    $scope.cardTypeList = newCard.cardTypes;
  }else{
    return;
  }
//  $scope.cardTypeList = [{"id":1,"lable":"29 Data"},{"id":2,"lable":"49 Data"}];

  $scope.addNewCard = function(){
    var cardD = {};
    cardD.serialNumber=$scope.cardDetails.serialNo;
    cardD.cardType=$scope.cardDetails.cardType;

    CardPoolService.addNewCard(cardD, function(result){
            console.log(result);
    });
  }



}]);
;app.controller('viewCardTypesController', ['$scope', 'CardPoolService', 'cardTypeDetails', '$modal', 'PaginationService',
    function ($scope, CardPoolService, cardTypeDetails, $modal, PaginationService) {

        $scope.pageSize=10;
        $scope.pagination = [];
        if (typeof cardTypeDetails.countries !== 'undefined') {
            $scope.countries = cardTypeDetails.countries;
        } else {
            return;
        }
        if (typeof cardTypeDetails.operators !== 'undefined') {
            $scope.operators = cardTypeDetails.operators;
        } else {
            return;
        }
        $scope.tableHeight = 400;
        change_size();
        function change_size() {
            $scope.tableHeight = $(window).height() - 215 - $(".table-scroll").height();
        }
        function managePagination(cardDetails) {
            $scope.cardTypesList = cardDetails.content;
            $scope.totalPages = cardDetails.totalPages;
            $scope.isFirstPage = cardDetails.first;
            $scope.isLastPage = cardDetails.last;
            $scope.page = cardDetails.number;
            $scope.pagination = [];
            if ($scope.totalPages > 1) {
                $scope.pagination = PaginationService.generatePagination($scope.totalPages, $scope.page);
            }
            $scope.limitStart = PaginationService.checkLimitStart($scope.page, $scope.pagination.length);
        }
        if (typeof cardTypeDetails.cardTypes !== 'undefined') {
            managePagination(cardTypeDetails.cardTypes);
        } else {
            return;
        }
        /*$scope.editCardType = function(){
         SubscriberService.save()
         };*/
        $scope.filter = {
            country: '',
            operator: '',
            cardType: ''
        };
        $scope.deleteCardType = function (type) {
            CardPoolService.deleteCardType({'id': type.id}, function () {
                $scope.cardTypesList.splice($scope.cardTypesList.indexOf(type), 1);
            });
        };

        function getDetails() {
            var cardDetails = {
                lable: '',
                networkOperator: {},
                allocation: [],
                validityPeriod: '',
                validityPeriod: '',
                valPeriodUnits: '',
                extraUsageCharge: '',
                ussdCode: ''
            }
            return cardDetails;
        }

        function allocationDTO() {
            var temp = {};
            temp.volume = '';
            temp.units = '';
            temp.startTime = '';
            temp.endTime = '';
            temp.serviceType = '';
            return temp;
        }

        $scope.editCardType = function (selectedType) {
            var editCardTypeScope = $scope.$new(true);
            editCardTypeScope.cardDetails = angular.copy(selectedType);
            editCardTypeScope.countries = $scope.countries;
            editCardTypeScope.operators = $scope.operators;
            editCardTypeScope.submitForm = false;

            editCardTypeScope.type = "Edit";
            editCardTypeScope.close = function () {
                angular.element('.modal').trigger('click')
            };
            editCardTypeScope.allocationDetails = allocationDTO();
            editCardTypeScope.editCardDetails = function () {
                editCardTypeScope.submitForm = true;
                if (editCardTypeScope.cardDetails.lable && editCardTypeScope.cardDetails.networkOperator) {
                    CardPoolService.updateCardType(editCardTypeScope.cardDetails, function (result) {
                        selectedType = result;
                        angular.element('.modal').trigger('click')
                    });
                }

            };

            editCardTypeScope.addAllocation = function () {
                if (editCardTypeScope.allocationDetails.volume) {
                    editCardTypeScope.cardDetails.allocation.push(editCardTypeScope.allocationDetails);
                    editCardTypeScope.allocationDetails = allocationDTO();
                }

            };
            editCardTypeScope.removeAllocation = function (allocation) {
                editCardTypeScope.cardDetails.allocation.splice(editCardTypeScope.cardDetails.allocation.indexOf(allocation), 1);

            };
            editCardTypeScope.selectCountry = function (country) {
                operators = [];
                for (var i = 0; i < editCardTypeScope.operators.length; i++) {
                    if (country.id === editCardTypeScope.operators[i].country.id) {
                        operators.push(editCardTypeScope.operators[i]);
                    }
                }
                editCardTypeScope.operators = operators;
            };
            var modal = $modal({
                scope: editCardTypeScope,
                templateUrl: "views/cardPool/addEditCardType.html",
                show: true
            });
        };

        $scope.addNewCardType = function () {
            var addCardTypeScope = $scope.$new(true);
            addCardTypeScope.cardDetails = getDetails();
            addCardTypeScope.countries = $scope.countries;
            addCardTypeScope.operators = $scope.operators;
            addCardTypeScope.submitForm = false;
            addCardTypeScope.type = "Add";
            addCardTypeScope.allocationDetails = allocationDTO();
            addCardTypeScope.addAllocation = function () {
                if (addCardTypeScope.allocationDetails.volume) {
                    addCardTypeScope.cardDetails.allocation.push(addCardTypeScope.allocationDetails);
                    addCardTypeScope.allocationDetails = allocationDTO();
                }

            };
            addCardTypeScope.allocationDetails = allocationDTO();
            addCardTypeScope.removeAllocation = function (allocation) {
                addCardTypeScope.cardDetails.allocation.splice(addCardTypeScope.cardDetails.allocation.indexOf(allocation), 1);

            };
            addCardTypeScope.close = function () {
                angular.element('.modal').trigger('click')
            };
            addCardTypeScope.addCardDetails = function () {
                addCardTypeScope.submitForm = true;
                if (addCardTypeScope.cardDetails.lable && addCardTypeScope.cardDetails.networkOperator) {
                    CardPoolService.addCardType(addCardTypeScope.cardDetails, function (result) {
                        CardPoolService.getCardType(function (result) {
                            $scope.cardTypesList = result;
                        });
                        $scope.cardTypesList.push(result);
                        angular.element('.modal').trigger('click')
                    });
                }
            };
            addCardTypeScope.selectCountry = function (country) {
                operators = [];
                for (var i = 0; i < addCardTypeScope.operators.length; i++) {
                    if (country.id === addCardTypeScope.operators[i].country.id) {
                        operators.push(addCardTypeScope.operators[i]);
                    }
                }
                addCardTypeScope.operators = operators;
            };

            var modal = $modal({
                scope: addCardTypeScope,
                templateUrl: "views/cardPool/addEditCardType.html",
                show: true
            });
        };
        function loadPage(pageNo) {
            CardPoolService.getCardType({"page": pageNo, "size": $scope.pageSize, sort: 'id'}, function (response) {
                managePagination(response);
            });
        }

        $scope.loadNextPage = function (id) {
            loadPage(id);
        };

        $scope.pageNavigation = function (type) {
            if (type === "prev") {
                $scope.page = $scope.page - 1;
                loadPage($scope.page);
            }
            else {
                $scope.page = $scope.page + 1;
                loadPage($scope.page);
            }
        };

    }]);
;app.controller('deliveryLogController', ['$scope', 'Logs','DeliveryLogService', function($scope, Logs, DeliveryLogService){
    $scope.deliveryLog = {};
    $scope.pageSize = 10;
    console.log($scope.pageSize);

}]);
;app.controller('crmController', ['$scope', '$modal', 'CrmService', '$routeParams',  function($scope, $modal, CrmService, $routeParams){
    // define tab panel
    $scope.tabs = [
        {title: 'GSM History', url: 'views/crm/gsmHistory.html', active: true, type: 'gsm'},
        {title: 'Reload History', url: 'views/crm/reloadHistory.html', active: false, type: 'reload'},
        {title: 'Event History', url: 'views/crm/eventHistory.html', active: false, type: 'event'},
        {title: 'XBOSS History', url: 'views/crm/xbossHistory.html', active: false, type: 'xboss'},
        {title: 'Complains', url: 'views/crm/complainsHistory.html', active: false, type: 'complains'}
    ];
    $scope.gsmDSata= {};
    $scope.reloadData={};
    $scope.eventData = {};
    $scope.xbossData={};
    $scope.complainsData ={};

    function getTabIndex(tabType) {
        var index = '';
        for (var i = 0; i < $scope.tabs.length; i++) {
            if ($scope.tabs[i].type === tabType) {
                index = i;
                return index;
            }
        }

    }
    function loadContent() {
        if ($scope.tabs[$scope.selectedTab].type === 'gsm') {                                   //message incoming log
            CrmService.view({

            }, function (response) {

            });
        }
        else if ($scope.tabs[$scope.selectedTab].type === 'reload') {
            $scope.reloadData.history = [
                {
                    "date":1484795795221,
                    "cardType":{
                        "id": 2,
                        "lable": "99 Data",
                        "networkOperator": {
                            "id": 2,
                            "operatorName": "Dialog",
                            "mnc": 2,
                            "mcc": 413,
                            "isActive": true,
                            "country": {
                                "id": 1,
                                "countryName": "Sri Lanka"
                            },
                            "active": true
                        },
                        "validityPeriod": 3,
                        "valPeriodUnits": "Days",
                        "ussdCode": "#123#PIN#",
                        "extraUsageCharge": 0.5,
                        "isActive": true,
                        "allocation": [{
                            "id": 3,
                            "serviceType": "Data",
                            "volume": 100,
                            "units": "MB",
                            "startTime": 28800000,
                            "endTime": 79200000,
                            "isActive": true,
                            "active": true
                        }],
                        "active": true
                    },
                    "transactionId":4234232355,
                    "status":"Success",
                    "note":"Low balance"
                },
                {
                    "date":1484795795221,
                    "cardType":{
                        "id": 2,
                        "lable": "99 Data",
                        "networkOperator": {
                            "id": 2,
                            "operatorName": "Dialog",
                            "mnc": 2,
                            "mcc": 413,
                            "isActive": true,
                            "country": {
                                "id": 1,
                                "countryName": "Sri Lanka"
                            },
                            "active": true
                        },
                        "validityPeriod": 3,
                        "valPeriodUnits": "Days",
                        "ussdCode": "#123#PIN#",
                        "extraUsageCharge": 0.5,
                        "isActive": true,
                        "allocation": [{
                            "id": 3,
                            "serviceType": "Data",
                            "volume": 100,
                            "units": "MB",
                            "startTime": 28800000,
                            "endTime": 79200000,
                            "isActive": true,
                            "active": true
                        }],
                        "active": true
                    },
                    "transactionId":4234232360,
                    "status":"Success",
                    "note":"Low balance"
                }
                ];
            CrmService.view({}, function (response) {

            });
        }
        else if ($scope.tabs[$scope.selectedTab].type === 'event') {

            CrmService.view({}, function (response) {

            });
        }
        else if ($scope.tabs[$scope.selectedTab].type === 'xboss') {

            CrmService.view({}, function (response) {

            });
        }
        else if ($scope.tabs[$scope.selectedTab].type === 'complains') {

            CrmService.view({}, function (response) {

            });
        }
    }
    if ($routeParams.type) {
        angular.forEach($scope.tabs, function (tab) {
            tab.active = false;
        });
        var index = getTabIndex($routeParams.type);
        $scope.tabs[index].active = true;
        $scope.selectedTab = index;
        loadContent();
    }


}]);
