var app = angular.module("sims", ['ngRoute', 'mgcrea.ngStrap', 'ngResource', 'ngAnimate', 'angular-loading-bar','ngCookies']);
app.run(['$rootScope', '$route', function($rootScope, $route) {

 'use strict';

    $rootScope.$on('$routeChangeSuccess', function() {

      $rootScope.title = $route.current.title;

      });


}]);
app.config(['$resourceProvider', '$alertProvider', 'cfpLoadingBarProvider', '$httpProvider', function($resourceProvider, $alertProvider, cfpLoadingBarProvider, $httpProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
  cfpLoadingBarProvider.includeBar = false;
  cfpLoadingBarProvider.spinnerTemplate = '<div><div id="overlay"><span class="loader"></span></div></div>';
  angular.extend($alertProvider.defaults, {
    animation: 'am-fade-and-slide-top',
    placement: 'top',
    container : "#alerts-container",
    show: true,
    duration : 5,
    templateUrl : "views/alert/alert.tpl.html"
  });
}]);
