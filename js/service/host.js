app.service('host', function() {
  var url = "https://sims.kh.techleadintl.com";

  return {

    'get' : function(){
        return url;
    }
  }
});
