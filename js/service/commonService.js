app.service('CommonService', function ($http,$cookies,$rootScope,localStorageService) {

    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);

        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })

            .success(function (data) {
                return data;
            })

            .error(function (data) {
                return data;
            });
    };

    this.getUserID = function(id){
        if(id){
            var user = angular.copy(id);
            return parseInt(user.split('.').join(''),16).toString()
        }
        else{
            return null;
        }

    };

    this.generatePagination = function (totalPages, page) {
        var pagination = [];
        for (var i = 0; i < totalPages; i++) {
            pagination.push({"id": i, active: false});
        }
        pagination[page].active = true;
        return pagination;
    };

    //handle pagination start position
    this.checkLimitStart = function (page, length) {
        var limitStart = 0;
        var limit = 10;
        if (limit < length) {
            var end = page + limit - 1;
            if (length <= end) {
                var diff = end - length;
                limitStart = end - limit -diff;

            }
            else if(page>(limit-1)){
                limitStart =  page ;
            }
            else{
                limitStart = 0;
            }

        }
        return limitStart;

    };



});
