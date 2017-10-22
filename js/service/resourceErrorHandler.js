app.service('resourceErrorHandler', function($alert,$rootScope, $location) {

var Alert = {};
function JSONParser(valueSet) {
    try {
        return JSON.parse(valueSet);
    } catch (e) {
        return false;
    }
    return true;
};
return function (res){

  Alert.title =res.status && res.status.toString();

  if(res.status == 404){

      Alert.content = "{\"message\" : \"Something wrong with the API\"}";
      Alert.type = 'warning';

  }else if(res.status == 405){

      Alert.content = "{\"message\" : \"Method not allowed\"}";
      Alert.type = 'warning';

  }else if(res.status == 403){
      $rootScope.logOut();
      Alert.content ="{\"message\" : \"Forbidden\"}";
      Alert.type = 'warning';

  }else if(res.status == 500){
       /* if(res.data && res.data.exception ==="io.jsonwebtoken.ExpiredJwtException"){
            $rootScope.logOut();
        }
        else{
            Alert.content = "{\"message\" : \"Server Error\"}";
            Alert.type = 'warning';
        }*/
       // Invalid JWT TOKEN - Clear Refresh token from server

       if(res.data){
           if(JSONParser(res.data)){
               if(JSONParser(res.data).message && ((JSON.parse(res.data).message ==="Invalid JWT TOKEN") || (JSON.parse(res.data).message ==="Not a sims web user"))){
                   localStorage.removeItem('ls.id_token');
                   localStorage.removeItem('ls.refresh_token');
                   $location.path('/');
               }
               else if(JSONParser(res.data).path && (JSON.parse(res.data).path === "/sims-login-service/getAuthToken")){
                   localStorage.removeItem('ls.id_token');
                   localStorage.removeItem('ls.refresh_token');
                   $location.path('/');
               }
               else{
                   Alert.content = "{\"message\" : \"Server Error\"}";
                   Alert.type = 'warning';
               }
           }
           else{
               Alert.content = "{\"message\" : \"Server Error\"}";
               Alert.type = 'warning';
           }

       }
       else{
           Alert.content = "{\"message\" : \"Server Error\"}";
           Alert.type = 'warning';
       }


  }

  $alert(Alert);

}

});
