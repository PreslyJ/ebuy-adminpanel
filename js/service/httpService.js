app.service('HttpService', function($resource, $alert, resourceErrorHandler, host ,resourceSuccessHandler) {

    return $resource(host.get() + '/sims-operator-api/operator/view:id', {}, {
        'getAllProducts':{url :  host.get() +'/ebuy-cart-service/cart/getAllProducts',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'getAllCategories':{url :  host.get() +'/ebuy-cart-service/cart/getAllCategories',method:'POST', interceptor : {responseError : resourceErrorHandler}},
        'saveProduct':   {url :  host.get() +'/ebuy-cart-service/cart/saveProduct', method:'PUT', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'saveCategory':   {url :  host.get() +'/ebuy-cart-service/cart/saveCategory', method:'PUT', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deleteCategory': {url :  host.get() +'ebuy-cart-service/cart/deleteCategory/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deleteSubCategory': {url :  host.get() +'ebuy-cart-service/cart/deleteSubCategory/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getAllSubCategories':   {url : host.get() +'/ebuy-cart-service/cart/getAllSubCategories', method:'POST', interceptor : { responseError : resourceErrorHandler}},
        'saveSubCategory':   {url :  host.get() +'/ebuy-cart-service/cart/PUT', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getAllItems':   {url :  host.get() +'/ebuy-cart-service/cart/getAllItems', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'saveItem':   {url :  host.get() +'/ebuy-cart-service/cart/PUT', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deleteItem': {url :  host.get() +'ebuy-cart-service/cart/deleteItem/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}}


    });
});

