app.service('dashBoardService', function($resource, $alert, resourceSuccessHandler, resourceErrorHandler, host,localStorageService) {

    return $resource(host.get() + '/dashboard/view', {  }, {
        'view':   {method:'GET', interceptor : {responseError : resourceErrorHandler}},
        'getSubscriberInfo':{url : host.get() + '/sims-dashboard-api/dashboard/subscriberInfo', method:'GET',  interceptor : {responseError : resourceErrorHandler}},
        'getCardPoolInfo':{url : host.get() + '/sims-dashboard-api/dashboard/cardPoolInfo',ignoreLoadingBar: true,method:'GET',interceptor:{responseError : resourceErrorHandler}},
        'findAlerts':{url : host.get() + '/sims-dashboard-api/dashboard/findAlerts',method:'GET',headers:{Cookie:'nginxauth="ZHVzaDpkdXNoMTIzNA=="'},ignoreLoadingBar: true,interceptor:{responseError : resourceErrorHandler}},
        'alertInfo':{url : host.get() + '/sims-dashboard-api/dashboard/alertInfo',method:'GET',ignoreLoadingBar: true,interceptor:{responseError : resourceErrorHandler}},
        'saveEventAction':{url :  host.get() + '/sims-dashboard-api/dashboard/saveEventActions',method:'POST',interceptor:{responseError : resourceErrorHandler}},
        'saveAutomaticScheduler':{url :  host.get() + '/sims-dashboard-api/dashboard/saveAutomaticScheduler',method:'POST',interceptor:{responseError : resourceErrorHandler}},
        'findAutomaticScheduler':{url :  host.get() + '/sims-dashboard-api/dashboard/findAutomaticScheduler',method:'Get',interceptor:{responseError : resourceErrorHandler}},
        'getRobotConfig':{url :  host.get() + '/sims-dashboard-api/dashboard/findRobotConfig',method:'GET',ignoreLoadingBar: true,interceptor:{responseError : resourceErrorHandler}},
        'getThresholdConfig':{url :   host.get() + '/sims-dashboard-api/dashboard/getThresholdSettings',method:'GET',isArray:true,interceptor:{responseError : resourceErrorHandler}},
        'saveRobotConfig':{url :  host.get() + '/sims-dashboard-api/dashboard/saveRobotConfig',method:'POST',ignoreLoadingBar: false,interceptor:{responseError : resourceErrorHandler}},
        'saveThresholdConfig':{url :  host.get() + '/sims-dashboard-api//sims-dashboard-api/dashboard/setThresholdSettings',method:'POST',ignoreLoadingBar: false,interceptor:{responseError : resourceErrorHandler}},
        'rechargeForSim':{url :  host.get() + '/sims-dashboard-api/dashboard/rechargeForSim/:id',method:'GET',interceptor:{responseError : resourceErrorHandler}},
        'synPacketForSim':{url :  host.get() + '/sims-dashboard-api/dashboard/synPacketForSim/:id',method:'GET',interceptor:{responseError : resourceErrorHandler}},
        'logOut': {url : host.get() +'/sims-login-service/logout', method:'POST', ignoreLoadingBar: true,interceptor : {response : resourceSuccessHandler ,responseError : resourceErrorHandler}},
        'loginDetails':{url:host.get()+'/sims-login-service/login/getUserDetails',method:'POST',ignoreLoadingBar: true,interceptor:{responseError : resourceErrorHandler}},
        'systemFileList' :{url:host.get()+'/sims-dashboard-api/dashboard/listDir',method:'GET',ignoreLoadingBar: true,interceptor:{responseError : resourceErrorHandler}},
        'systemFileDelete':{url:host.get()+'/sims-dashboard-api/dashboard/deleteFile',method:'POST',ignoreLoadingBar: true,interceptor:{responseError : resourceErrorHandler}},
        'systemFileEdit' :{url:host.get()+'/sims-dashboard-api/dashboard/renameFile',method:'POST',ignoreLoadingBar: true,interceptor:{responseError : resourceErrorHandler}}


      });
      
});
