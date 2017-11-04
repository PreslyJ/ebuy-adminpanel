app.service('host', function() {
  var url = "http://presly";

  return {

    'get' : function(){
        return url;
    }
  }
});
