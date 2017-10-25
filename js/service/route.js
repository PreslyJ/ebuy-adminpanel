app.config(function($routeProvider, $locationProvider) {

//$locationProvider.html5Mode(true);
    $routeProvider
        .when('/dashboard', {
            title: 'Dashboard',
            templateUrl: 'views/index.html',
            controller: 'dashboardController',
            resolve: {

          }
        })
        .when('/product', {
            title: 'Product',
            templateUrl: 'views/product/product.html',
            controller: 'productController',
            resolve: {

            }
        })
        .when('/category', {
            title: 'Product',
            templateUrl: 'views/category/category.html',
            controller: 'categoryController',
            resolve: {

            }
        })
        .when('/item', {
            title: 'Item',
            templateUrl: 'views/product/item.html',
            controller: 'itemController',
            resolve: {

            }
        })
        .when('/sub-category', {
            title: 'Sub-Category',
            templateUrl: 'views/category/sub-category.html',
            controller: 'subCategoryController',
            resolve: {

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
