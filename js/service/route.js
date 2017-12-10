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
        .when('/customer', {
            title: 'customer',
            templateUrl: 'views/customers/customers.html',
            controller: 'customersController',
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
        .when('/stock-report', {
            title: 'Stock Report',
            templateUrl: 'views/report/stockReport.html',
            controller: 'reportController',
            resolve: {

            }
        })
        .when('/credit-report', {
            title: 'Credit Report',
            templateUrl: 'views/report/creditReport.html',
            controller: 'reportController',
            resolve: {

            }
        })
        .when('/', {
            title: 'login',
            templateUrl: 'login/login.html',
            controller: 'loginController',
        })
        .when('/stockItem', {
            title: 'stockItem',
            templateUrl: 'views/product/stockItem.html',
            controller: 'stockItemController',
            resolve: {

            }
        })

        // If 404
        .otherwise({
            redirectTo: '/'
        });
});
