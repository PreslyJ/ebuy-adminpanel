app.service('DeliveryLogService', function($resource, $alert, resourceSuccessHandler, resourceErrorHandler, host) {

    return $resource(host.get() +'/sims-template/deliverylog/view', {}, {
      'view':   {method:'GET', interceptor : {responseError : resourceErrorHandler}}
      });
});
