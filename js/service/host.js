app.service('host', function() {
  	
  	var url = "http://presly";


	this.get=function(){
		return url;
	};


	this.cartport= function () {
		return ':8082';
	};

	 this.loginport= function () {
 		return ':8081';
	 };

});
