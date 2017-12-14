app.service('HttpService', function($resource, $alert, resourceErrorHandler, host ,resourceSuccessHandler,$rootScope) {

    return $resource(host.get() + '/ebuy-cart-service/cart/getAllProducts', {}, {
        'getAllProducts':{url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/getAllProducts',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'getAllCategories':{url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/getAllCategories',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'saveProduct':   {url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/saveProduct', method:'PUT', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'saveCategory':   {url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/saveCategory', method:'PUT', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deleteCategory': {url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/deleteCategory/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deleteSubCategory': {url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/deleteSubCategory/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getAllSubCategories':   {url : host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/getAllSubCategories', method:'POST', interceptor : { responseError : resourceErrorHandler}},
        'saveSubCategory':   {url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/saveSubCategory', method:'PUT', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getAllItems':   {url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/getAllItems', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'saveItem':   {url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/saveItem', method:'PUT', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deleteItem': {url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/deleteItem/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getAllCustomer':{url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/customer/getAllCustomer',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'saveUser':   {url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/saveUser', method:'PUT', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getAllUsers':{url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/customer/getAllUsers',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'getAllStockItems':{url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/getAllStockItems',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'saveStockItems':{url :  host.get() +$rootScope.cartPort+'/ebuy-cart-service/cart/saveStockItem',method:'PUT', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getStockReport':{url :  host.get() +rootScope.reportPort+'/ebuy-reporting-api/report/getStockReport',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'getSalesSummaryReport':{url :  host.get() +rootScope.reportPort+'/ebuy-reporting-api/report/getSalesSummaryReport',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'getProfitReport':{url :  host.get() +rootScope.reportPort+'/ebuy-reporting-api/report/getProfitReport',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'loginDetails':{url:host.get()+$rootScope.loginPort+'/ebuy-login-service/login/getUserDetails',method:'POST',ignoreLoadingBar: true,interceptor:{responseError : resourceErrorHandler}}
    });
});

