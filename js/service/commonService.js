app.service('CommonService', function ($http,$cookies,$rootScope,localStorageService) {

    this.log= "";
    this.isOnline =null;
    this.transactionDetails ={};
    this.resourceType = [
        {"parentId":1,"id":101,"description":"Common balance"},
        {"parentId":1,"id":102,"description":"Specified balance"},
        {"parentId":1,"id":103,"description":"Free"},
        {"parentId":2,"id":201,"description":"On-net"},
        {"parentId":2,"id":202,"description":"Local off-net"},
        {"parentId":2,"id":203,"description":"toll off-net"},
        {"parentId":2,"id":204,"description":"international"},
        {"parentId":2,"id":205,"description":"Free"},
        {"parentId":3,"id":301,"description":"On-net"},
        {"parentId":3,"id":302,"description":"Local off-net"},
        {"parentId":3,"id":303,"description":"toll off-net"},
        {"parentId":3,"id":304,"description":"international"},
        {"parentId":3,"id":305,"description":"Free"},
        {"parentId":4,"id":401,"description":"local"},
        {"parentId":4,"id":402,"description":"Roam"},
        {"parentId":4,"id":403,"description":"Free"},
    ];
    this.serviceList = [
        {"id":1, "lable":"Account"},
        {"id":2, "lable":"Voice"},
        {"id":3, "lable":"SMS"},
        {"id":4, "lable":"Data"},
    ];


    this.setTransactionData = function (data) {
        this.transactionDetails = data;

        angular.forEach(this.transactionDetails.transactionLogDetail, function(step,key){
            step.active = false;
            if(key ==0 ){
                    step.active =true;
            }
            step.content =    "{\"TRN\":\"{\\\"transactionId\\\":1966310,\\\"description\\\":\\\"Init Reload transaction\\\",\\\"card\\\":{\\\"lupTimeStamp\\\":1496643957926,\\\"id\\\":1313326,\\\"serialNumber\\\":\\\"***************72\\\",\\\"cardType\\\":{\\\"id\\\":2096,\\\"lable\\\":\\\"Dialog 50\\\",\\\"validityPeriod\\\":7,\\\"volume\\\":500,\\\"isActive\\\":true,\\\"allocations\\\":[],\\\"templateId\\\":491,\\\"operatorId\\\":2,\\\"agentOnly\\\":false,\\\"active\\\":true},\\\"isActive\\\":true,\\\"status\\\":\\\"R\\\",\\\"active\\\":true},\\\"imei\\\":\\\"1644937578\\\",\\\"type\\\":\\\"TOP_UP\\\",\\\"Status\\\":\\\"INIT\\\",\\\"status\\\":\\\"INIT\\\"}\",\"CardType\":\"{\\\"id\\\":2096,\\\"lable\\\":\\\"Dialog 50\\\",\\\"validityPeriod\\\":7,\\\"volume\\\":500,\\\"isActive\\\":true,\\\"allocations\\\":[],\\\"templateId\\\":491,\\\"operatorId\\\":2,\\\"agentOnly\\\":false,\\\"active\\\":true}\",\"TYPE\":\"Card\",\"CARD\":\"{\\\"lupTimeStamp\\\":1496643957926,\\\"id\\\":1313326,\\\"serialNumber\\\":\\\"***************72\\\",\\\"cardType\\\":{\\\"id\\\":2096,\\\"lable\\\":\\\"Dialog 50\\\",\\\"validityPeriod\\\":7,\\\"volume\\\":500,\\\"isActive\\\":true,\\\"allocations\\\":[],\\\"templateId\\\":491,\\\"operatorId\\\":2,\\\"agentOnly\\\":false,\\\"active\\\":true},\\\"isActive\\\":true,\\\"status\\\":\\\"R\\\",\\\"active\\\":true}\"}";

        });
    };
    this.getTransactionData = function () {
        return this.transactionDetails;
    };
    var eventList  = [
        /*{"id": 1, "label": "EVT_USER_VAS_QUERY_REQUEST", "active": false},*/
        {"id": 2, "label": "EVT_VAS_QUERY_RES_RECEIVED", "active": false},
        {"id": 4, "label": "EVT_MAIN_QUERY_RES_RECEIVED", "active": false},
        {"id": 1, "label": "EVT_MAIN_TOPUP_RES_RECEIVED", "active": false},
        {"id": 8, "label": "EVT_VAS_ACT_RES_RECEIVED", "active": false},
        {"id": 32, "label": "EVT_SELF_NO_RES_RECEIVED", "active": false},
        {"id": 64, "label": "PLAN_ACTIVATION_RES_RECEIVED", "active": false}
    ];

    this.getEventList= function () {
        return eventList;
    };
    this.setCountry = function (id) {
       $cookies.put('country', id);
    };
    this.getCountry = function () {
        return parseInt($cookies.get('country'))||null;
    };
    this.setOnlineState = function (status) {
        $cookies.put('isOnline', status);
    };
    this.getOnlineStatus = function () {
        return $cookies.get('isOnline')||null;
    };
    this.getRelevantOperators = function (id, operatorList) {
        var operators = [];
        for (var i = 0; i < operatorList.length; i++) {
            if (id == operatorList[i].country.id) {
                operators.push(operatorList[i]);
            }
        }
        return operators
    };
    this.setLogData = function (log) {
        this.log= log;
    };
    this.getlogData = function () {
        return this.log;
    };
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
    // reload data mapping to summary
    /*this.mapSummaryData = function (summaryData) {

     var summary = [];
     var reloadData = [];
     var reloadIndex =[];
     if(summaryData[1]!=undefined){
     angular.forEach(summaryData[0], function (balance) {
     summary.push(balance);
     });
     angular.forEach(summaryData[1], function (reload) {
     var temp = {};
     temp.balance = null;
     temp.balanceType = 20;
     temp.expireDate = null;
     temp.id = reload.id;
     temp.lupTimeStamp = reload.lupTimeStamp;
     summary.push(temp);
     reloadData.push(temp);
     });
     summary.sort(function (a, b) {
     return a.lupTimeStamp - b.lupTimeStamp
     });

     angular.forEach(reloadData,function (re) {
     var index =summary.indexOf(re);
     reloadIndex.push(index)
     });
     }

     var data = {};
     data.summary = summary;
     data.reloadIndex = reloadIndex;
     return data;
     };*/
    this.mapLineIndex = function (data) {
        var reloadIndex =[];
        angular.forEach(data,function (re,key) {
            if(re.balanceType ==11){
                reloadIndex.push(key)
            }

        });
        return  reloadIndex;
    };
    this.mapCDRLineIndex = function (data) {
        var cdrIndex =[];
        angular.forEach(data,function (re,key) {
            if(re.balanceType ==12){
                cdrIndex.push(key)
            }

        });
        return  cdrIndex;
    };
    this.mapValueData = function (data,cdrData) {

        angular.forEach(data,function (re,key) {
            if(re.balanceList){
                angular.forEach(re.balanceList, function (val,key) {
                    val.expiryDate = moment(parseInt(val.expiryDate)).format("DD MMM YYYY HH:mm:ss")
                    if(re.balanceType ==1 || re.balanceType ==2 ){
                      val.value = (val.value).toFixed(2);
                    }
                })
            }


        });
        angular.forEach(cdrData,function (cdr) {
            var temp={};
            temp.balance=1;
            temp.balanceList=null;
            temp.balanceType=12;
            temp.lupTimeStamp=cdr.lupTimeStamp;
            temp.status=null;

            data.push(temp);
        });
        var dataContent = _.sortBy(data, function(o) { return o.lupTimeStamp; });
        return  dataContent;
    };
    this.mapSummaryData = function (summaryData,eventHistory) {

        var summary = summaryData;

        var reloadData = [];
        var reloadIndex =[];
        if(summaryData){
            angular.forEach(eventHistory, function (event) {
                var temp = {};
                temp.balance = null;
                temp.balanceType = 20;
                temp.expireDate = null;
                temp.id = event.id;
                temp.lupTimeStamp = event.eventDate;
                summary.push(temp);
            });
            summary.sort(function (a, b) {
                return a.lupTimeStamp - b.lupTimeStamp
            });

            angular.forEach(summary,function (re,key) {
                if(re.balanceType == 11){
                    reloadIndex.push(key)
                }
            });
        }

        var data = {};
        data.summary = summary;
        data.reloadIndex = reloadIndex;
        return data;
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
    this.getSelectedEvents = function (selectedList) {
        var events = [];
        angular.forEach(selectedList, function (event) {
            events.push(_.find(eventList,{id:event.id}));
        });
        return events;
    };
    this.getModifiedEvents = function (selectedList) {
        var events = [];
        angular.forEach(selectedList, function (event) {
            events.push({id:event.id});
        });
        return events;
    };
// Tasks flow related common functions

    //override Action label
    function getActionLabel(key){
        var actionLabels = {
            "Out": "Outgoing Process",
            "TRN":"Transaction Details",
            "In":"Incoming Messages",
            "IN":"Incoming Messages",
            "ALERT":"Alert Information",
            "CARD":"Card Details",
            "TEMPLATE":"Template Details",
            "ERROR":"Error Details",
            "CardType":"Card Type",
            "CMD":"Command"
        };
        if(actionLabels[key]){
            return actionLabels[key];
        }
        else{
            return key;
        }
    }

   //Process action list data
    this.processActionList2  = function(content){
        var actionList =[];
        content = $rootScope.JSONParser(content);
        for(var key in content){
            var temp={};
            temp.type = key;
            temp.actionLabel= getActionLabel(key);
            temp.link = "";
            temp.valueSet=[];
            temp.actionInclude = false;
            temp.actionDetails=[];
            temp.tooltipDetails = $rootScope.JSONParser(angular.copy(content[key]));
            if(key ==='ERROR'){
                var valueSet = {
                    "Reason":content[key]
                };
                temp.valueSet.push(valueSet);
            }
            else if(key ==='OUT'){
                value= $rootScope.JSONParser(content[key]);
                if(value){
                    angular.forEach(value.commonLogDetails, function(value){
                        var valueSet={
                            "Log":value.message +"  -  "+ moment(value.logDate).format("DD/MM/YY HH:mm:ss")
                        };

                        temp.valueSet.push(valueSet);
                    })
                }
            }
            else if(key ==='RET' || key ==='CMD'){
                    var val={
                        "Action":content[key]
                    };
                    temp.valueSet.push(val);
            }
            else if(key ==='DSC'){
                var val={
                    "Description":content[key]
                };

                temp.valueSet.push(val);
            }
            else{
                value= $rootScope.JSONParser(content[key]);
                for(var k  in value){
                    var t ={};
                    t[k] = '';
                    t[k] =  value[k];
                    if(key === 'TRN' && (k ==='description'  )){
                        temp.valueSet.push(t);
                    }
                    else if((k === 'lable' || k ==='validityPeriod' || k ==='volume' ||k ==='agentOnly' ) && key ==='CardType'){
                        temp.valueSet.push(t);
                        temp.actionInclude = true;
                        temp.actionDetails.push(value)
                    }
                    else if(( k ==='serialNumber' || k ==='status'  ) && key ==='CARD'){
                        if( k ==='status' ){
                            temp.actionInclude = true;
                            temp.actionDetails.push(angular.copy(k))
                        }
                        if(value[k] ==='R'){
                            t[k] = "Unused";
                        }
                        else if(value[k] ==='P'){
                            t[k] = "Await Confirm";
                        }
                        else if(value[k] ==='C'){
                            t[k] = "Confirm";
                        }

                        temp.valueSet.push(t);
                    }
                    else if(key ==='TEMPLATE'){
                        if(k ==="templateId"){
                            temp.actionInclude = true;
                            temp.actionDetails.push(t);
                        }
                        else{
                            temp.valueSet.push(t);
                        }
                    }
                    else if(key ==='ALERT'){
                        if(k==='message' || k ==="event"){
                            temp.valueSet.push(t);
                        }
                        else if(k==='eventDate'){
                            t[k] =  moment(value[k]).format("DD/MM/YY HH:mm:ss");
                            temp.valueSet.push(t);
                        }

                    }
                    else if(key ==='IN'){
                        if(k ==='messageText'){
                            temp.valueSet.push({"message":value[k]});
                            temp.actionInclude = true;
                            temp.actionDetails.push(t);
                        }
                        if( k ==='valueSet' ){
                            t[k] = ($rootScope.JSONParser(value[k]))['valSet'];
                            temp.actionInclude = true;
                            temp.actionDetails.push(t);
                        }
                    }
                    else if(key ==='SBSRES'){
                        temp.actionDetails.push(t);
                    }


                }
            }
            actionList.push(temp);
        }
        return actionList;
    };
    this.processActionList  = function(contentDetails){
        var actionList =[];
        angular.forEach(contentDetails, function(action){
            var content = $rootScope.JSONParser(action.content);

                var temp={};
                temp.type = action.name;
                temp.actionLabel= getActionLabel(action.name);
                temp.link = "";
                temp.valueSet=[];
                temp.actionInclude = false;
                temp.actionDetails=[];
                temp.tooltipDetails = content;
                if(action.name ==="In" || action.name ==="IN" || action.name==="INmming Message"){
                    for(var i=0;i<content.length;i++){
                        for(var key in content[i]){
                            var t ={};
                            t[key] = '';
                            t[key] =  content[i][key];
                            if(key ==="valueSet" && !!content[i][key]){
                                t[key] = ($rootScope.JSONParser(content[i][key]))['valSet'];
                                /*temp.actionInclude = true;
                                temp.actionDetails.push(t);*/
                                temp.valueSet.push(t);
                            }
                            if(key ==='id'){
                                /*temp.actionInclude = true;
                                temp.actionDetails.push(t);*/
                                temp.valueSet.push(t);
                            }
                            else if(key === "messageText" ){

                                temp.valueSet.push({"Message":content[i][key]});
                            }
                            else if(key === "filteredDate" ){
                                temp.valueSet.push({"Date":moment(content[i][key]).format("DD/MM/YY HH:mm:ss")});
                            }
                        }
                    }


                }
                else if(content && content != 'null'){
                    for(var key in content){
                        var t ={};
                        t[key] = '';
                        t[key] =  content[key];
                        if(action.name ==='OUT' || action.name ==='Out') {
                            if(key ==='commonLogDetails'){
                                if(content.commonLogDetails){
                                    angular.forEach(content.commonLogDetails, function(value){
                                        var valueSet={
                                            "Log":value.message +"  -  "+ moment(value.logDate).format("DD/MM/YY HH:mm:ss")
                                        };

                                        temp.valueSet.push(valueSet);
                                    })
                                }
                            }
                            else if(key ==='processId'){
                                temp.actionInclude = true;
                                temp.actionDetails.push(t);
                            }

                        }
                        else if(action.name === 'Perform VASQuery Details'){
                            if(key ==='templateId'){
                                temp.actionInclude = true;
                                temp.actionDetails.push(t);
                            }
                            else{
                                temp.valueSet.push(t);
                            }
                        }
                        else if( action.name ==='Card'){
                            if( key ==='serialNumber' || key ==='status' ) {
                                if( key ==='status' ){
                                    temp.actionInclude = true;
                                    temp.actionDetails.push(angular.copy(t))
                                }
                                if(content[key] ==='R'){
                                    t[key] = "Unused";
                                }
                                else if(content[key] ==='P'){
                                    t[key] = "Await Confirm";
                                }
                                else if(content[key] ==='C'){
                                    t[key] = "Confirm";
                                }
                                if(key !== 'cardType'){
                                    temp.valueSet.push(t);
                                }
                            }

                        }
                        else if(action.name ==='Card Type'){
                            if(key === 'lable' || key ==='validityPeriod' || key ==='volume' ||key ==='agentOnly' ){
                                temp.valueSet.push(t);
                            }
                        }
                        else if(action.name === 'TRN' ){
                          if(key ==='description' || key ===' Status ' ){
                                temp.valueSet.push(t);
                            }

                        }
                        else{
                                temp.valueSet.push(t);
                        }


                    }
                }

                actionList.push(temp);
        });


        return actionList;
    };

    //override workflow main step label
    this.workFlowLables = {
        "sendQueryVAS_QUERY": "Query from Mobile",
        "processGenericReplyVAS_QUERY": "Process Query Response",
        "sendQueryMAIN_QUERY": "Check Balance",
        "processGenericReplyMAIN_QUERY": "Process Balance Response",
        "performMainTopup": "Send Topup Command",
        "processTopupResponse": "Process Topup Response",
        "performVasQuery": "Query Activation Balance",
        "processVasQueryResponse": "Process Query Response",
        "sendWakeCall": "Wake mobile",
        "sendEcho": "Check Connectivity",
        "sendCommand": "Send Command to mobile",
        "testOnline": "Test Online Status",
        "completeRegistration": "Complete Registration",
        "sendBasicTemplate": "Query Mobile",
        "processBasicTemplateReply": "Process Query Response",
        "performMainQuery": "Query Main Balance",
        "processMainQueryResponse": "Process Main Query Response",
        "performVasActivation": "Send Plan Activation Request",
        "processVasTopupResponse": "Process Plan Activation Response",
        "completeTopup": "Complete Process",
        "performDirectTopup": "Direct Topup Mobile",
        "processDirectTopupResponse": "Process Direct Topup Response",
        "performDirectVas": "Send Direct Plan Activation Request",
        "processDirectVasResponse": "Process Direct Plan Activation Response",
        "getSelfNumber": "Request Mobile Number",
        "processSelfNumberResponse": "Process Mobile Number Response",
        "handleMessageByParser": "Parse Message"
    };
    this.getReadableTransactionLable = function(key){
        if(this.workFlowLables[key]){
            return this.workFlowLables[key];
        }
        else{
            return key;
        }
    };

    //handle breadcum
    var fromLocation='log/taskflows';
    this.setWorkflowNavigationFrom = function (from) {
        fromLocation = from;
    };
    this.getWorkflowFromLocation = function(){
      return fromLocation;
    };
    var t = 0;
    this.getRefreshToken = function(){
            console.log("T : "+t);
            t++;
            /*var http = {
                method: 'POST',
                url: "http://"+window.location.hostname+":8086/sims-login-service/getAuthToken",
                contentType: "text/plain",
                headers:{'refresh':localStorageService.get("refresh_token")},
                transformResponse : function(data, headersGetter, status){
                    data = headersGetter();
                    return data;
                }
            };
            $http(http)
                .success(function (data, status, headers, config) {
                    localStorageService.set("id_token",data.authorization);
                    localStorageService.set("refresh_token",data.refresh);
                    return data.authorization;

                }).error(function (response) {
                     $rootScope.logOut();
            });*/

    }

    this.templateFormValidate = function(template){
        var formValidate =false;
        if(template.name && template.operator.id && template.templateType  && template.templateText){
            if(template.templateType.isRequest){
                if(template.method=='SMS' && !isNaN(template.destination)){
                     formValidate =true ;
                     return formValidate;
                }
                else if (template.method=='USSD'){
                    formValidate =true ;
                    return formValidate;
                }
            }
            else {
                    if(template.eventList.length>0){
                        formValidate =true;
                        return  formValidate
                    }
            }
        }
        return formValidate;
    }

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
