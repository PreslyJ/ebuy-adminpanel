app.service('resourceSuccessHandler', function($alert) {

var Alert = {};

return function (res){

  Alert.title = res.status.toString();

  if(res.status == 200 && res.data && res.data.resultCode != 1012 && res.data.resultCode !=1013 && res.data.resultCode !=1014 && res.data.code !=1015){

      Alert.content ={};
      Alert.content="{\"message\" : \"Your request has been successful\"}";
      Alert.type = 'success';

  }
  else if(res.status == 200 && (res.data.resultCode == 1012 || res.data.resultCode ==1014 ) && res.data.resultCode !=1013 && res.data.code !=1015){
      Alert.content ={};
      Alert.content="{\"message\" : \""+ res.data.msgInfo +"\"}";
      Alert.type = 'warning';
  }
  else if(res.status == 200 &&  res.data.code ==1015  &&  res.data.resultCode != 1012 && res.data.resultCode !=1013 && res.data.resultCode !=1014 ){
      Alert.content ={};
      Alert.content="{\"message\" : \""+ res.data.message +"\"}";
      Alert.type = 'warning';
  }
  else if(res.status == 200 && res.data.resultCode != 1012 &&  res.data.resultCode !=1014 ){
      Alert.content ={};
      Alert.content="{\"message\" : \"Your request has been successful\"}";
      Alert.type = 'success';
  }

  $alert(Alert);
  return res.data;

}

});
