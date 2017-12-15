app.controller('loginController', ['$scope', '$http', '$cookies', '$location', '$rootScope','localStorageService','HttpService',
    function ($scope, $http, $cookies, $location, $rootScope,localStorageService,HttpService) {
    // $('.header').hide();
    // $('.left-side ').hide();

    $scope.userName = "";
    $scope.password = "";

    $scope.login_error = false;
    $scope.error_message = ""


    function pageNavigation() {
        if (!!localStorageService.get('refresh_token')) {
            $location.path('/dashboard');
        }
        else {
            $location.path('/');
        }
    }
        pageNavigation();
    $scope.login = function () {


        $scope.submitted = true;
        if ($scope.password && $scope.password) {
            doLogin();
        }
    };
    function doLogin() {
        var param = {};
        param["username"] = $scope.userName;
        param["password"] = $scope.password;
        $scope.error_message = "";
        $scope.login_error = false;

        var http = {
            method: 'POST',
            url:  $rootScope.loginApp+'login',
            data: param,
            skipAuthorization: true,
            contentType: "text/plain",
            transformResponse : function(data, headersGetter, status){
                if(status !=500){
                    data = headersGetter();


                }
                return data;
            }
        };
   
        $http(http)
            .success(function (data, status, headers, config) {
                    console.log(data);
                   // $location.path('/dashboard');
                    localStorageService.set("id_token",data.authorization);
                    localStorageService.set("refresh_token",data.refresh);
                    localStorage.removeItem('user_fname');
                    localStorage.removeItem('user_lname');
                    HttpService.loginDetails(function (response) {

                    localStorageService.set("user_fname",response.firstName.charAt(0).toUpperCase() + response.firstName.substr(1).toLowerCase());
                    localStorageService.set("user_lname",response.surname.charAt(0).toUpperCase() + response.surname.substr(1).toLowerCase());
                });

                    $location.path('/dashboard');
                    //request.getResponseHeader('Authorization')
                    //console.log(response.headers())

            }).error(function (response) {
                    $scope.login_error = true;
                    if(response && $rootScope.JSONParser(response)){
                        if(JSON.parse(response).message ==="Not a sims web user"){
                            $scope.error_message = JSON.parse(response).message;
                        }
                        else{
                            $scope.error_message =  "Invalid User Name or Password";
                        }
                    }
                    else{
                        $scope.error_message =  "Invalid User Name or Password";
                    }

            console.log(response);
        });

    }
}]);
