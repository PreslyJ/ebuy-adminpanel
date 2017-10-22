app.service('SubscriberService', function($resource, $alert, resourceErrorHandler, resourceSuccessHandler, host) {

    return $resource(host.get()+'/sims-subscriber-api/subscriber/view/:id', {}, {
        'view':  {method:'GET', interceptor : {responseError : resourceErrorHandler}},
        'findSubscriberById':{url : host.get() + '/sims-subscriber-api/subscriber/findSubscriberById/:id',ignoreLoadingBar: true, method:'GET', interceptor : {}},
        'findSubscriber':{url : host.get() + '/sims-subscriber-api/subscriber/findSubscriber/', method:'POST',ignoreLoadingBar: true, interceptor : {responseError : resourceErrorHandler}},
        'viewByFilter':{url : host.get() + '/sims-subscriber-api/subscriber/search', method:'POST',ignoreLoadingBar: true, interceptor : {responseError : resourceErrorHandler}},
        'viewByFilterWithLoading':{url : host.get() + '/sims-subscriber-api/subscriber/search', method:'POST', ignoreLoadingBar: false,interceptor : {responseError : resourceErrorHandler}},
        /*'sendCard':{url : host.get() + '/sims-subscriber-api/subscriber/sendCard', method:'POST', isArray:true, interceptor : {responseError : resourceErrorHandler}},*/
        'query':{url : host.get() + '/sims-subscriber-api/subscriber/querySubscriber',method:'POST', interceptor : {response : resourceSuccessHandler,responseError : resourceErrorHandler}},
        'autoQuery':{url : host.get() + '/sims-subscriber-api/subscriber/querySubscriber',method:'POST', interceptor : {response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'save':{url : host.get() + '/sims-subscriber-api/subscriber/create',method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'update':{url : host.get() + '/sims-subscriber-api/subscriber/update',method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'delete': {url :  host.get() +'/sims-subscriber-api/subscriber/delete/:id', method:'DELETE', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'getAllocatedPackages':{url :  host.get() +'/sims-subscriber-api/subscriber/getAvailablePackagesForUser', method:'POST', isArray:true, ignoreLoadingBar: true,interceptor : { responseError : resourceErrorHandler}},
        'reserveCard':{url : host.get() +'/sims-subscriber-api/subscriber/reserveCardForUser',method:'POST', ignoreLoadingBar: true,interceptor : { responseError : resourceErrorHandler}},
        'cancelTransaction':{url :  host.get() +'/sims-subscriber-api/subscriber/cancelTransaction/:id', method:'POST',ignoreLoadingBar: true, interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'sendCard':{url :  host.get() +'/sims-subscriber-api/subscriber/confirmTransaction', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'activateVAS':{url :  host.get() +'/sims-subscriber-api/subscriber/activateVas', method:'POST', interceptor : { response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'sendEcho':{url : host.get() + '/sims-subscriber-api/subscriber/sendEcho/:id',method:'GET',ignoreLoadingBar: true, interceptor : {responseError : resourceErrorHandler}},
        'resetUserData':{url : host.get() + '/sims-subscriber-api/subscriber/resetUserData/:id',method:'GET', interceptor : {response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'queryInfoForSim':{url :  host.get() + '/sims-subscriber-api/subscriber/queryInfoForSim/:id',method:'GET',interceptor:{responseError : resourceErrorHandler}},
        'fixRegistration':{url :  host.get() + '/sims-subscriber-api/subscriber/fixRegistration/:id',method:'GET',interceptor:{response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'isLockedUser':{url :  host.get() + '/sims-subscriber-api/subscriber/isLockedUser/:id',method:'GET',interceptor:{responseError : resourceErrorHandler}},
        'findEventByProcessId':{url :  host.get() + '/sims-subscriber-api/subscriber/findEventByProcessId/:id',method:'GET',interceptor:{responseError : resourceErrorHandler}},
        'getPlanHistory':{url :  host.get() + '/sims-subscriber-api/subscriber/findSubscriberPlanHistoryBySubscriberId/:id',ignoreLoadingBar: true, method:'GET',isArray:true,  interceptor : {responseError : resourceErrorHandler}},
        'getEventByLogDetailId':{url :  host.get() + '/sims-subscriber-api/subscriber/findEventIdByTransactionId/:id',ignoreLoadingBar: true, method:'GET', interceptor : {responseError : resourceErrorHandler}}

    });
});