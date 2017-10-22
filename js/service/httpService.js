app.service('HttpService', function($resource, $alert, resourceErrorHandler, host ,resourceSuccessHandler) {

    return $resource(host.get() + '/sims-operator-api/operator/view:id', {}, {
        'getAllProducts':{url :  host.get() +'/ebuy-cart-service/cart/getAllProducts',method:'GET', interceptor : {responseError : resourceErrorHandler}},
        'saveProduct':   {url :  host.get() +'/ebuy-cart-service/cart/saveProduct', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'update':   {url :  host.get() +'/sims-operator-api/operator/update', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'viewByFilter':   {url :  host.get() +'/sims-operator-api/operator/search', method:'POST', interceptor : { responseError : resourceErrorHandler}},
        'query':  {method:'GET', isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'remove': {method:'DELETE', interceptor : {responseError : resourceErrorHandler}},
        'delete': {url :  host.get() +'/sims-operator-api/operator/delete/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getVasListByOperator': {url : host.get() +'/sims-operator-api/operator/getVASListByOperator', method:'POST',isArray:true, interceptor : { responseError : resourceErrorHandler}},
        'agentView':{url : host.get() +'/sims-operator-api/operatorAgent/view',method:'GET',ignoreLoadingBar: true,isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'agentDetailsById':{url : host.get() +'/sims-operator-api/operatorAgent/agentDetailsById/:id',method:'GET',ignoreLoadingBar: true,isArray:true, interceptor : {responseError : resourceErrorHandler}},
        'createAgent':{url : host.get() +'/sims-operator-api/operatorAgent/create',method:'POST',ignoreLoadingBar: false,isArray:true, interceptor : {response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deleteAgent': {url :  host.get() +'/sims-operator-api/operatorAgent/delete/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'viewPlanByFilterWithLoading':   {url : host.get() +'/sims-operator-api/plan/viewPlans', method:'POST',ignoreLoadingBar: false, interceptor : { responseError : resourceErrorHandler}},
        'viewPlanByFilter':   {url : host.get() +'/sims-operator-api/plan/viewPlans', method:'POST',ignoreLoadingBar: true,interceptor : { responseError : resourceErrorHandler}},
        'savePlan':   {url :  host.get() +'/sims-operator-api/plan/createPlan', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'updatePlan':   {url :  host.get() +'/sims-operator-api/plan/updatePlan', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deletePlan': {url :  host.get() +'/sims-operator-api/plan/deletePlan/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getActivePromotionWithLoading':   {url :  host.get() +'/sims-operator-api/plan/getActivePromotionPackageType', method:'POST',ignoreLoadingBar: false, interceptor : { responseError : resourceErrorHandler}},
        'getActivePromotion':   {url :  host.get() +'/sims-operator-api/plan/getActivePromotionPackageType', method:'POST',ignoreLoadingBar: true,interceptor : { responseError : resourceErrorHandler}},
        'updatePromotion':   {url : host.get() +'/sims-operator-api/plan/packageType/create', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'viewAllActivePackageTypes': {url : host.get() +'/sims-operator-api/plan/viewPackageTypeByOperatoryId/:id', method:'GET',isArray:true, interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'createPackageType':   {url :  host.get() +'/sims-operator-api/plan/packageType/create', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'deletePackageType': {url :  host.get() +'/sims-operator-api/plan/deletePackageType/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getActiveCard':   {url :  host.get() +'/sims-operator-api/plan/getActivePackageTypeByPackageSubType', method:'POST',ignoreLoadingBar: false, interceptor : { responseError : resourceErrorHandler}} ,
        'getActiveCardTypeList':   {url :  host.get() +'/sims-operator-api/plan/getActivePackageTypeByPackageSubTypeList', method:'POST',ignoreLoadingBar: false,isArray:true, interceptor : { responseError : resourceErrorHandler}} ,
        'getSubTypes':   {url : host.get() +'/sims-operator-api/plan/getPromotionSubTypeNames/:packageSubTypeCategory', method:'GET',ignoreLoadingBar: true,isArray:true,  interceptor : { responseError : resourceErrorHandler}},
        'getCardSubTypes':   {url :  host.get() +'/sims-operator-api/plan/getCardSubTypeNames', method:'GET',ignoreLoadingBar: true,isArray:true,  interceptor : { responseError : resourceErrorHandler}},
        'getResourceTypes':   {url :  host.get() +'/sims-operator-api/plan/viewPackageSubTypes', method:'GET',ignoreLoadingBar: true,isArray:true,  interceptor : { responseError : resourceErrorHandler}},
        'viewPlanListByOperatorId':   {url : host.get() +'/sims-operator-api/plan/viewPlanListByOperatorId/:id', method:'GET',ignoreLoadingBar: true,isArray:true,  interceptor : { responseError : resourceErrorHandler}},
        'getActiveCardTypesByOperator':{url : host.get() + '/sims-operator-api/plan/getActiveCardTypesByOperator/:id',ignoreLoadingBar: true, method:'GET',isArray:true,  interceptor : {responseError : resourceErrorHandler}},
        'getPlanListByOperatorIdAndPlanType':{url : host.get() + '/sims-operator-api/plan/getPlanListByOperatorIdAndPlanType',ignoreLoadingBar: true, method:'POST',isArray:true,  interceptor : {responseError : resourceErrorHandler}},
        'getActivePlanListByPackageSubTypeName':{url : host.get() + '/sims-operator-api/plan/getActivePlanListByPackageSubTypeName',ignoreLoadingBar: true, method:'POST',isArray:true,  interceptor : {responseError : resourceErrorHandler}},
        'getActivePackageTypeById':{url : host.get() + '/sims-operator-api/plan/getActivePackageTypeById/:id',ignoreLoadingBar: true, method:'GET',isArray:false,  interceptor : {responseError : resourceErrorHandler}},
        'getActiveCardTypesByOperatorWithValidations':{url :  host.get() + '/sims-operator-api/plan/getActiveCardTypesByOperatorWithValidations/:id',ignoreLoadingBar: true, method:'GET',isArray:true,  interceptor : {responseError : resourceErrorHandler}}


    });
});

