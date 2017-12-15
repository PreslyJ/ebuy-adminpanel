var app = angular.module("ebuy", ['ngRoute', 'mgcrea.ngStrap', 'ngResource', 'ngAnimate', 'chart.js', 'angular-loading-bar', 'ngCookies',
    'btford.socket-io', 'angularMoment', 'anguFixedHeaderTable', 'fillHeight', 'ngclipboard', 'CustomDirectives', 'ui.bootstrap.datetimepicker', 'angularjs-dropdown-multiselect', 'moment-picker', 'angular-jwt'
,'LocalStorageModule','ngMap','ADM-dateTimePicker','ng.jsoneditor','fixed.table.header','ngFileUpload']);



app.run(['$rootScope', '$route', '$alert',  '$window', '$cookies', '$location', '$http','authManager','localStorageService','jwtHelper',
    function ($rootScope, $route, $alert,  $window, $cookies, $location, $http, authManager,localStorageService,jwtHelper) {


        $rootScope.cartPort=':8082';
        $rootScope.loginPort=':8082';
        $rootScope.reportPort=':8082';
        $rootScope.loginApp='http://'+window.location.hostname+':8082/ebuy-login-service/';

        authManager.redirectWhenUnauthenticated();
        $http.get('version.txt').then(function (res) {
            $rootScope.version = res.data;
        });

        $rootScope.loginUserName = localStorageService.get("user_fname") + " " + localStorageService.get("user_lname");

        $rootScope.automaticStatus = false;

        $rootScope.notifications = {};
        $rootScope.notifications.alertList = [];
        $rootScope.notifications.alertCount = 0;
        $rootScope.notifications.messageList = [];
        $rootScope.robotConfig = {};
        'use strict';


        function selectMainMenu(index) {
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
        }

        function selectSubMenu(subMenu, index) {
            angular.forEach(subMenu, function (sub) {
                sub.active = false;
            });
            subMenu[index].active = true;

        }

        function mapRouteToMenu() {
            var route = $route.current;
            var mainMenu = {};
            var mainMenuIndex = $rootScope.menuList.indexOf(_.find($rootScope.menuList, {originalPath: $location.path()}));
            if (mainMenuIndex != undefined && mainMenuIndex != -1 && !$rootScope.menuList[mainMenuIndex].active ) {
                selectMainMenu(mainMenuIndex);
            }
            else {
                angular.forEach($rootScope.menuList, function (mainMenu) {
                    mainMenu.active = false;
                    mainMenu.subMenuActive = false;
                    angular.forEach(mainMenu.subMenu, function (sub) {
                        sub.active = false;
                    });
                });

                for (var i = 0; i < $rootScope.menuList.length; i++) {
                    for (var k = 0; k < $rootScope.menuList[i].subMenu.length; k++) {
                        if ($location.path() === $rootScope.menuList[i].subMenu[k].originalPath) {
                            $rootScope.menuList[i].active = true;
                            $rootScope.menuList[i].subMenuActive = true;
                            $rootScope.menuList[i].subMenu[k].active = true;
                        }
                    }
                }
            }

        }

        $rootScope.$on('$routeChangeSuccess', function () {

            $rootScope.title = $route.current.title;
            mapRouteToMenu();
            /*if ($location.path() !== '/' && !$cookies.get('token')) {
             $location.path('/');
             }*/
            $rootScope.breadcrumbs = [];
            var location = $location.path().split("/");
            angular.forEach(location, function (value, key) {
                if (key === 1) { //for give access to parent
                    $rootScope.breadcrumbs.push({"value": value, "path": value});
                }
                else {
                    $rootScope.breadcrumbs.push({"value": value, "path": $location.path()})
                }
            });


            $rootScope.loginUser = $cookies.get('loginUser') || '';
            $rootScope.JSONParser = function (valueSet) {
                try {
                    return JSON.parse(valueSet);
                } catch (e) {
                    return false;
                }
                return true;
            };
           // loadNotificationData();
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
                "mainMenu": "User",
                "route": "#/user",
                "active": true,
                "icon": "fa-table",
                "subMenuActive": false,
                "subMenu": [],
                "originalPath": '/user'
            },
            {
                "mainMenu": "customer",
                "route": "#/customer",
                "active": true,
                "icon": "fa-table",
                "subMenuActive": false,
                "subMenu": [],
                "originalPath": '/customer'
            },
            {
                "mainMenu": "Category",
                "route": "#/category",
                "active": true,
                "icon": "fa-table",
                "subMenuActive": false,
                "subMenu": [],
                "originalPath": '/category'
            },
            {
                "mainMenu": "Sub-Category",
                "route": "#/sub-category",
                "active": true,
                "icon": "fa-table",
                "subMenuActive": false,
                "subMenu": [],
                "originalPath": '/sub-category'
            },
            {
                "mainMenu": "Item",
                "route": "#/item",
                "active": true,
                "icon": "fa-table",
                "subMenuActive": false,
                "subMenu": [],
                "originalPath": '/item'
            },
            {
                "mainMenu": "Stock In",
                "route": "#/stockItem",
                "active": true,
                "icon": "fa-table",
                "subMenuActive": false,
                "subMenu": [],
                "originalPath": '/stockItem'
            },
            {
                "mainMenu": "Reports",
                "route": "javascript:void(0);",
                "active": false,
                "icon": "fa fa-file-text-o",
                "subMenuActive": false,
                "subMenu": [
                    {
                        "title": "Stock Report",
                        "route": "#/stock-report",
                        "active": false,
                        "icon": "fa-line-chart",
                        "originalPath": '/stock-report'
                    },
                    {
                        "title": "Sales Summary Report",
                        "route": "#/sales-report",
                        "active": false,
                        "icon": "fa-file-text-o",
                        "originalPath": '/sales-report'
                    },
                    {
                        "title": "Profit Report",
                        "route": "#/profit-report",
                        "active": false,
                        "icon": "fa-file-text-o",
                        "originalPath": '/profit-report'
                    }

                ],
                "originalPath": '/report'
            }

        ];
        $rootScope.clickOnMainMenu = function (index) {
            if($rootScope.isCollasped){

                $rootScope.collapseSideBar();

            }
            selectMainMenu(index);
        };
        $rootScope.clickOnSubMenu = function (subMenu, index) {
            selectSubMenu(subMenu, index);

        };

        $rootScope.collapseSideBar = function (){
            $rootScope.isCollasped = !$rootScope.isCollasped ;

            var eleB = angular.element( document.querySelector( 'body' ) );
            if($rootScope.isCollasped){
                console.log("table broadcast");
                $rootScope.$broadcast('table-content');
                eleB.addClass('sidebar-collapse');

            }
            else{
                 eleB.removeClass('sidebar-collapse');
            }

        }

        $rootScope.disableCollapse = function(isCollasped){
            if($rootScope.isCollasped) {
                return {
                    'display': ' none'
                }
            }
        }



        $rootScope.logOut = function () {
                localStorage.removeItem('ls.id_token');
                localStorage.removeItem('ls.refresh_token');
                $location.path('/');

        };

        $rootScope.getHexValue = function (value) {
            if (value) {
                var hexa = parseInt(value).toString(16).toUpperCase();
                hexa = hexa.replace(/(.{2})(?!$)/g, '$1.');
                return hexa;
            }
            else {
                return null;
            }

        };
        $rootScope.getPlacement = function (index) {
            if (15 < index) {
                return 'top';
            }
            else {
                return "bottom";
            }
        };

        // handle route changes without loading controller
        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };
    }]);

app.config(['$resourceProvider', '$alertProvider', 'cfpLoadingBarProvider', '$httpProvider', '$compileProvider', '$popoverProvider', 'jwtOptionsProvider',
    function ($resourceProvider, $alertProvider, cfpLoadingBarProvider, $httpProvider, $compileProvider, $popoverProvider,jwtOptionsProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        $resourceProvider.defaults.stripTrailingSlashes = false;
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.spinnerTemplate = '<div><div id="overlay"></div></div>';

        angular.extend($popoverProvider.defaults, {
            animation: 'am-flip-x',
            autoClose: true
        });


        angular.extend($alertProvider.defaults, {
            animation: 'am-fade-and-slide-top',
            placement: 'top',
            container: "#alerts-container",
            show: true,
            duration: 5,
            templateUrl: "views/alert/alert.tpl.html"
        });
        function isValidToken(expireDate){
            var status = false;
            var expire = expireDate - 30000; // 30000 -time gap to handle expire
            status = moment().isAfter(expire);
            console.log("Is Expire "+moment().isAfter(expire));
            console.log("ExpireDateTime "+expire);
            console.log("CurrentDateTime "+moment());
            return status;

        }
        //angular jwt Authorization handling
        jwtOptionsProvider.config({
            authPrefix: '',
            whiteListedDomains: [window.location.hostname,"presly","localhost"],
            tokenGetter: ['jwtHelper','CommonService','$http','$rootScope','$location', function (jwtHelper,CommonService,$http,$rootScope,$location) {

                var token = localStorage.getItem('ls.id_token');
                var refreshToken = localStorage.getItem("ls.refresh_token");
                if (((token && isValidToken(jwtHelper.decodeToken(token).exp*1000) && refreshToken  ) || (!token && refreshToken )) && !jwtHelper.isTokenExpired(refreshToken)) {                   //get refresh token
                    console.log("ExpireDate "+jwtHelper.getTokenExpirationDate(token));
                    console.log(jwtHelper.getTokenExpirationDate(token));
                    return $http({
                        url: $rootScope.loginApp+'getAuthToken',
                        skipAuthorization: true,
                        method: 'POST',
                        contentType: "text/plain",
                        headers:{'refresh':refreshToken.replace(/^"(.*)"$/, '$1')},
                        ignoreLoadingBar: true,
                        transformResponse : function(data, headersGetter, status){
                            if(status !=500){
                                data = headersGetter();
                            }

                            return data;
                        }
                    }).then(function(response) {
                        localStorage.setItem("ls.id_token",response.data.authorization);
                        token = response.data.authorization;
                        token = token.replace(/^"(.*)"$/, '$');
                        return token;
                    });



                    return token;
                } else if(token  && !isValidToken(jwtHelper.decodeToken(token).exp*1000)  && !jwtHelper.isTokenExpired(refreshToken)) {
                    console.log(jwtHelper.isTokenExpired(token));
                    token = token.replace(/^"(.*)"$/, '$1');
                    return token;
                }
                else{
                    localStorage.removeItem('ls.id_token');
                    localStorage.removeItem('ls.refresh_token');
                    $location.path('/');                                            //return token;
                }

            }],
            unauthenticatedRedirectPath: '/'
        });

        $httpProvider.interceptors.push('jwtInterceptor');
        $httpProvider.defaults.headers.common['Content-Type']='text/plain';
        $httpProvider.defaults.headers.common['Vary']='Origin';
    }]);
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.filter('prettyJSON', function () {
    function prettyPrintJson(json) {
        return JSON ? JSON.stringify(json, null, '  ') : 'your browser doesnt support JSON so cant pretty print';
    }
    return prettyPrintJson;
});

