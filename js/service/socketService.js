app.factory('socketService', function(socketFactory, $rootScope) {

      var socket = io(window.location.origin, {path:'/sims-feeder/socket.io', transports:["websocket"]});

      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        }
      };
});
