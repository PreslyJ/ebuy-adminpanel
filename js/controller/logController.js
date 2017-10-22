app.controller('logController', ['$scope', 'Logs', 'LogService', '$routeParams', 'PaginationService', 'SubscriberService', 'TemplateService', 'OperatorService','CommonService','$location','ReportService','$modal','NgMap','$timeout','$rootScope','dashBoardService',
    function ($scope, Logs, LogService, $routeParams, PaginationService, SubscriberService, TemplateService, OperatorService,CommonService,$location,ReportService,$modal,NgMap,$timeout,$rootScope,dashBoardService) {

        $scope.pageSize = 20;
        $scope.outPageSize = 20;
        $scope.tableHeight = 400;
        $scope.filterError="";
        $scope.calendar={};
        $scope.calendar.minDate ='';
        $scope.currentPage ="log";
        $scope.contentHeight=300;
        $scope.contentHeight2 =280;
        $scope.calendar.maxDate = moment().format("DD/MM/YY");
        $scope.eventList = CommonService.getEventList();


        // define tab panel
        $scope.tabs = [
            {title: 'Task Flows', url: 'views/report/sbsTransactionReport.html', active: true, type: 'taskflows'},
            {title: 'CDR ', url: 'views/log/cdrActivityLog.html', active: false, type: 'cdr'},
            {title: 'Incoming', url: 'views/log/smsIncomingLog.html', active: false, type: 'incoming'},
            {title: 'Outgoing', url: 'views/log/smsOutgoingLog.html', active: false, type: 'outgoing'}

        ];

        function getTabIndex(tabType) {
            var index = '';
            for (var i = 0; i < $scope.tabs.length; i++) {
                if ($scope.tabs[i].type === tabType) {
                    index = i;
                    return index;
                }
            }

        }
        function incomingFilterOption() {
            this.fromDate = null;
            this.toDate = null;
            this.parsed = "false";
            this.searchText = null;
            this.searchType = null;
        }

        $scope.incommingFilter = new incomingFilterOption();
        function outgoingFilterOption() {
            this.fromDate = null;
            this.toDate = null;
            this.searchText = null;
            this.searchType = null;
        }
        $scope.outgoingFilter = new outgoingFilterOption();

        function FilterOption() {
            // this.operatorId = null;
            // this.countryId = CommonService.getCountry();
            this.fromDate = null;
            this.toDate = null;
            this.searchText =null;
            this.searchType=null;
            this.isSuccess ="";
        }

        $scope.filterOption = new FilterOption();
        function cdrActivityFilterOption(){
            this.imei=null;
            this.cdrType=null;
        }
        $scope.cdrActivityFilter = new cdrActivityFilterOption();
        function selectIncomingFilterOption(pageNo) {
            var filter = {};
            filter.fromDate = $scope.incommingFilter.fromDate;
            filter.toDate = $scope.incommingFilter.toDate;
            filter.parsed = $scope.incommingFilter.parsed;
            if($scope.incommingFilter.searchType ==='imei' || $scope.incommingFilter.searchType ==='operatorName' || $scope.incommingFilter.searchType ==='countryName' ){
                filter.searchText = $scope.incommingFilter.searchText;
                filter.columnType = "String" ;
            }
            else if($scope.incommingFilter.searchType ==='templateFk'){
                filter.searchText = $scope.incommingFilter.searchText;
                filter.columnType = "long" ;
            }
            else{
                filter.searchText = $scope.incommingFilter.searchText;
                filter.columnType = "String";
            }

            filter.searchType = $scope.incommingFilter.searchType;


            LogService.viewIncomingByFilter({"page": pageNo, "size": $scope.pageSize, sort: $scope.incoming.sortBy+','+$scope.incoming.orderType}, filter, function (response) {
                $scope.incoming.messageLogs = response.content;
                //mapSubscriber();
                managePagination(response, 'incoming');
            });
        }
        function selectOutgoingFilterOption(pageNo) {
            var filter = {};
            filter.fromDate = $scope.outgoingFilter.fromDate;
            filter.toDate = $scope.outgoingFilter.toDate;
            filter.imei = CommonService.getUserID(angular.copy($scope.outgoingFilter.imei));
            if($scope.outgoingFilter.searchType ==='imei'){
                filter.searchText = $scope.outgoingFilter.searchText;
                filter.columnType = "String"
            }
            else{
                filter.searchText = $scope.outgoingFilter.searchText;
                filter.columnType = "long" ;
            }

            filter.searchType = $scope.outgoingFilter.searchType;
            LogService.viewOutgoingByFilter({"page": pageNo, "size": $scope.outPageSize, sort:$scope.outgoing.sortBy +','+$scope.outgoing.orderType}, filter, function (response) {
                $scope.outgoing.messageLogs = response.content;
                managePagination(response, 'outgoing');
            });
        }


        function validateSearchData(filterData) {
            var minLength = 15;
            var isValid = true;
            $scope.filterError="";
            if(filterData.toDate){
                if(!filterData.fromDate){
                    isValid = false;
                    $scope.filterError = "From date is required";
                }
                else if(!(moment(filterData.fromDate,"YYYY-MM-DD").isBefore(filterData.toDate,"YYYY-MM-DD")||moment(filterData.fromDate,"YYYY-MM-DD").isSame(filterData.toDate,"YYYY-MM-DD"))){
                    isValid = false;
                    $scope.filterError = "Invalid to date";
                }

            }
           return isValid;

        };
        $scope.searchIncomingMessage = function () {
            if(validateSearchData($scope.incommingFilter)){
                selectIncomingFilterOption(0);
            }
        };
        $scope.searchOutgoingMessage = function () {
            if(validateSearchData($scope.outgoingFilter)){
                selectOutgoingFilterOption(0);
            }
        };
        $scope.searchCdrActivity = function(){
            loadCdrActivityPage(0);
        };
        $scope.selectedTab = 0;
        $scope.incoming = {};
        $scope.outgoing = {};
        $scope.taskflows = {}
        $scope.cdrActivity = {};
        $scope.incoming.page = 0;
        $scope.outgoing.page = 0;
        $scope.taskflows.page = 0;
        $scope.cdrActivity.page = 0;
        $scope.incoming.isAscending = false;
        $scope.incoming.isDescending = true;
        $scope.incoming.orderType = 'desc';
        $scope.outgoing.isAscending = false;
        $scope.outgoing.isDescending = true;
        $scope.outgoing.orderType = 'desc';
        $scope.outgoing.sortBy="logDate";
        $scope.incoming.sortBy="filteredDate";
        $scope.taskflows.sortBy="id";
        $scope.taskflows.orderType="desc";
        // generate pagination
        function managePagination(messageDetails, type) {
            //$scope[type].messageLogs =messageDetails.content;
            $scope[type].isFirstPage = messageDetails.first;
            $scope[type].isFirstPage = messageDetails.first;
            $scope[type].isLastPage = messageDetails.last;
            $scope[type].page = messageDetails.number;
            $scope[type].totalPages = messageDetails.totalPages;
            $scope[type].pagination = [];
            if ($scope[type].totalPages > 1) {
                $scope[type].pagination = PaginationService.generatePagination($scope[type].totalPages, $scope[type].page);
            }
            $scope[type].limitStart = PaginationService.checkLimitStart($scope[type].page, $scope[type].pagination.length);
        }
        function mapTemplate(){
            angular.forEach($scope.incoming.messageLogs, function (message) {
                if (message.templateFk != 0) {
                    TemplateService.findTemplateById({'id': message.templateFk}, function (response) {
                        message.template = response;
                        /*message.template.operator = message.subscriber.operator;
                        OperatorService.viewOperatorById({"id": response.operatorId}, function (response) {
                            message.template.operator = response;
                        });*/
                    });
                }
                else {
                    message.template = null;
                }
            });
        }
        function mapSubscriber() {
            angular.forEach($scope.incoming.messageLogs, function (message) {
                message.subscriber={};
                if(message.imei){
                    SubscriberService.findSubscriber({"imeiNo": message.imei},'', function (response) {
                        message.subscriber = response;
                        if(message.subscriber.operatorId){
                            OperatorService.viewOperatorById({"id": message.subscriber.operatorId}, function (response) {
                                message.subscriber.operator = response;
                            });
                        }
                    });
                }
                else{
                    message.subscriber={};
                    message.subscriber.operator={};
                }
            });
            mapTemplate();
        }
        function loadIncomingPage(pageNo) {

            if(validateSearchData($scope.incommingFilter)){
                selectIncomingFilterOption(pageNo);
            }
        }

        function loadOutgoingPage(pageNo) {

            if(validateSearchData($scope.outgoingFilter)){
                selectOutgoingFilterOption(pageNo);
            }
        }
        function loadCdrActivityPage(pageNo) {
            if($scope.cdrActivityFilter.cdrType==""){
                $scope.cdrActivityFilter.cdrType=null;
            }
            if($routeParams.id){
                LogService.getCdrLogByProcessId({'id':$routeParams.id},function (response) {
                    $scope.cdrActivity.activityLogs=[];
                    $scope.cdrActivity.activityLogs[0] = response;
                    // managePagination(response, 'cdrActivity');
                    mapEvents($scope.cdrActivity.activityLogs);
                })
            }
            else{
                LogService.viewCdrByFilter({"page": pageNo, "size": $scope.pageSize,  sort: 'id,desc'},$scope.cdrActivityFilter, function (response) {
                    $scope.cdrActivity.activityLogs = response.content;
                    //mapSubscriber();
                    managePagination(response, 'cdrActivity');
                    mapEvents($scope.cdrActivity.activityLogs);
                });
            }

        }
        /*function manageSbsPagination(responseData) {
            $scope.totalPages = responseData.totalPages;
            $scope.isFirstPage = responseData.first;
            $scope.isLastPage = responseData.last;
            $scope.page = responseData.number;
            $scope.pagination = [];
            if ($scope.totalPages > 1) {
                $scope.pagination = PaginationService.generatePagination($scope.totalPages, $scope.page);
            }
            $scope.limitStart = PaginationService.checkLimitStart($scope.page, $scope.pagination.length);
        }*/
        //load sbs report data
        function loadSbsReportData(page) {
            var filter = {};
            filter.fromDate = $scope.filterOption.fromDate;
            filter.toDate = $scope.filterOption.toDate;
            filter.searchType = $scope.filterOption.searchType;
            filter.isSuccess = $scope.filterOption.isSuccess;
            if($scope.filterOption.searchType ==='imei'){
                filter.searchText = $scope.filterOption.searchText;
                filter.columnType = "String";
            }
            else if($scope.filterOption.searchType ==='id'){
                filter.searchText = parseInt($scope.filterOption.searchText);
                filter.columnType = "Long" ;
            }
            ReportService.getSbsReportData({"page":page ,"size":$scope.pageSize,sort:$scope.taskflows.sortBy+','+$scope.taskflows.orderType},filter, function (response) {
                $scope.taskflows.sbsTransactionData = response.content;
                mapSBSSubscriber();
                managePagination(response, 'taskflows');
            });
        }
        function getCDRStatus(log){
            var status = true;
            if(log.cdrFiles.length){
                angular.forEach(log.cdrFiles, function (file) {

                    if(file.status === "Process Success"){
                        status =true;
                    }
                    else{
                        status =false;
                        return status;
                    }

                });
            }
            else{
                status =false;
                return status;
            }

            return status;
        }
        function mapEvents(activityLogs){
            angular.forEach(activityLogs, function (log) {
                log.isSuccess = getCDRStatus(log);
                if(log.processId && log.processId !=0){
                    SubscriberService.findEventByProcessId({'id':log.processId},function (response) {
                        log.eventDetails = response;
                    })
                }
                else{
                    log.eventDetails={}
                }

            })

        }
        // load tab content

        function loadContent() {
            $scope.filterError ="";
            $scope.calendar.minDate ='';
            $scope.outgoingFilter = new outgoingFilterOption();
            $scope.incommingFilter = new incomingFilterOption();


            if ($scope.tabs[$scope.selectedTab].type === 'incoming') {                                   //message incoming log
               /* LogService.view({
                    "page": $scope.incoming.page,
                    "size": $scope.pageSize,
                    sort: 'filteredDate,desc'
                }, function (response) {
                    $scope.incoming.messageLogs = response.content;
                    mapSubscriber();
                    managePagination(response, 'incoming');
                });*/
               if($routeParams.id){
                   $scope.incommingFilter.id = parseInt($routeParams.id);
                   $scope.incommingFilter.parsed=''
                  // $scope.incommingFilter.searchType = "long";
                   LogService.viewIncomingByFilterWithLoading({"page": $scope.incoming.page, "size": $scope.pageSize, sort: 'filteredDate,'+$scope.incoming.orderType}, $scope.incommingFilter, function (response) {
                       $scope.incoming.messageLogs = response.content;
                       //mapSubscriber();
                       managePagination(response, 'incoming');
                   });
               }
               else{

                   $scope.incommingFilter.id = null;
                   LogService.viewIncomingByFilterWithLoading({"page": $scope.incoming.page, "size": $scope.pageSize, sort: 'filteredDate,'+$scope.incoming.orderType}, $scope.incommingFilter, function (response) {
                       $scope.incoming.messageLogs = response.content;
                       //mapSubscriber();
                       managePagination(response, 'incoming');
                   });
               }

            }
            else if ($scope.tabs[$scope.selectedTab].type === 'outgoing') {
                var filter = {};
                filter.fromDate = $scope.outgoingFilter.fromDate;
                filter.toDate = $scope.outgoingFilter.toDate;
                filter.imei = angular.copy($scope.outgoingFilter.imei);
                if($routeParams.id){
                    filter.searchText = parseInt($routeParams.id);
                    filter.searchType=  "processId";
                    filter.columnType="long"
                }
                LogService.viewOutgoingByFilterWithLoading({"page": 0, "size": $scope.outPageSize, sort: 'logDate,'+$scope.outgoing.orderType}, filter, function (response) {
                    $scope.outgoing.messageLogs = response.content;
                    managePagination(response, 'outgoing');
                });
                //loadOutgoingPage(0);
            }
            else if($scope.tabs[$scope.selectedTab].type === 'cdr'){
                if($routeParams.id){
                     LogService.getCdrLogByProcessId({'id':$routeParams.id},function (response) {
                         $scope.cdrActivity.activityLogs=[];
                         $scope.cdrActivity.activityLogs[0] = response;
                        // managePagination(response, 'cdrActivity');
                         mapEvents($scope.cdrActivity.activityLogs);
                     })
                }
                else{
                    LogService.viewCdrByFilterWithLoading({"page": $scope.cdrActivity.page, "size": $scope.pageSize, sort: 'id,desc'},$scope.cdrActivityFilter, function (response) {
                        $scope.cdrActivity.activityLogs = response.content;
                        //mapSubscriber();
                        managePagination(response, 'cdrActivity');
                        mapEvents($scope.cdrActivity.activityLogs);
                    });
                }

            }
            else if($scope.tabs[$scope.selectedTab].type ==='taskflows'){
                loadSbsReportData(0);
                console.log($scope.tabs[$scope.selectedTab].type);
            }
        }

        if ($routeParams.logType) {
            angular.forEach($scope.tabs, function (tab) {
                tab.active = false;
            });
            var index = getTabIndex($routeParams.logType);
            $scope.tabs[index].active = true;
            $scope.selectedTab = index;
            loadContent();
        }

        if (typeof Logs.types !== 'undefined') {
            $scope.types = Logs.types;
        } else {
            return;
        }

        if (typeof Logs.countries !== 'undefined') {
            $scope.countries = Logs.countries;
        } else {
            return;
        }
        $scope.selectedVlues = 'test';
        $scope.popover = {
            "title": "Values",
            "content": 'test'

        };
        $scope.outGoingPopover = {
            "title": 'Steps',
            "content": 'steps'
        };

        function JSONParser(valueSet) {
            try {
                return JSON.parse(valueSet);
            } catch (e) {
                return false;
            }
            return true;
        };
        $scope.JSONParser = function (valueSet) {
            return JSONParser(valueSet);
        };


        $scope.statusFilter = function (status) {
            $scope.incommingFilter.passed = status;
        };

        $scope.showDescription = function (log) {
            $scope.description = log;
            $scope.description_panel = true;
        };

        $scope.selectRecord = function (value) {
            $scope.selectedVlues = value.valSet;
        };
        $scope.selectOutGoingRecord = function (step) {
            $scope.selectedOutRecord = step;
        };


        $scope.loadNextPage = function (id, logType) {

            if (logType === 'incoming') {
                loadIncomingPage(id);
            }
            else if(logType === 'outgoing'){
                loadOutgoingPage(id);
            }
            else if(logType === 'taskflows'){
                loadSbsReportData(id);
            }
            else{
                loadCdrActivityPage(id);
            }
        };

        $scope.pageNavigation = function (type, logType) {
            if (type === "prev") {
                $scope[logType].page = $scope[logType].page - 1;
                if (logType === 'incoming') {
                    loadIncomingPage($scope[logType].page);
                }
                else if(logType === 'outgoing'){
                    loadOutgoingPage($scope[logType].page);
                }
                else if(logType === 'taskflows'){
                    loadSbsReportData($scope[logType].page);
                }
                else{
                    loadCdrActivityPage(id);
                }
            }
            else {
                $scope[logType].page = $scope[logType].page + 1;
                if (logType === 'incoming') {
                    loadIncomingPage($scope[logType].page);
                }
                else if(logType === 'outgoing'){
                    loadOutgoingPage($scope[logType].page);
                }
                else if(logType === 'taskflows'){
                    loadSbsReportData($scope[logType].page);
                }
                else{
                    loadCdrActivityPage($scope[logType].page);
                }
            }
        };
        $scope.trimMessage = function (message) {
            var text = message;
            if (message && message.length > 30) {
                text = message.substring(0, 30);
            }
            return text;
        };
        $scope.formatDate = function (selectedDate) {
            var date = '';

            return selectedDate;
        };


        $scope.tabClick = function (index) {
            angular.forEach($scope.tabs, function (tab) {
                tab.active = false;
            });
            $scope.selectedTab = index;
            $scope.tabs[index].active = true;
            loadContent()
        };

        changeTableSize();
        function changeTableSize() {
            $scope.tableHeight = $(window).height() - 265;  //215 = filter area height + table header  height
        }
        $scope.setCalendarMin = function () {
            $scope.calendar.minDate = moment(angular.copy($scope.incommingFilter.fromDate),"YYYY-MM-DD").format("DD/MM/YY");
        };
        var newTemplateScope, modal, modalEdit;

        function templateNew(log) {

            newTemplateScope = $scope.$new(true);
            newTemplateScope.templateNew = {};
            newTemplateScope.templateNew.isValidTemplate = false;
            newTemplateScope.templateNew.template_patten = /\(\?\<(.*?)\>/;
            newTemplateScope.templateNew.method = 'SMS';
            newTemplateScope.templateType = '';
            newTemplateScope.selectedEvent = '';
            newTemplateScope.events = [];
            newTemplateScope.countries = angular.copy(Logs.countries);
            newTemplateScope.operators = angular.copy(Logs.operators);
            newTemplateScope.types = angular.copy(Logs.types);
            newTemplateScope.eventDetailList = angular.copy($scope.eventList);
            newTemplateScope.submitted = false;
            newTemplateScope.submitValidation = false;
            newTemplateScope.templateNew.templateText= log.messageText;
            newTemplateScope.templateNew.sampleText  =log.messageText;
            newTemplateScope.templateNew.operator = log.subscriber.operator || {};

            newTemplateScope.tabs = [
                {title: 'REGEX Template',active: true, type: 'regex'},
                {title: 'Groovy Script', active: false, type: 'groovy'}
            ];
            newTemplateScope.isGroovyEmpty = false;
            newTemplateScope.selectedTab = newTemplateScope.tabs[0];
            newTemplateScope.tabClick = function (index) {
                angular.forEach(newTemplateScope.tabs, function (tab) {
                    tab.active = false;
                });
                newTemplateScope.selectedTab = newTemplateScope.tabs[index];
                newTemplateScope.tabs[index].active = true;

            };

            if(newTemplateScope.templateNew.operator.country.id){
                newTemplateScope.operators= CommonService.getRelevantOperators(newTemplateScope.templateNew.operator.country.id,angular.copy(Logs.operators));
            }
            newTemplateScope.selectCountry = function (id) {
                newTemplateScope.operators = CommonService.getRelevantOperators(id,angular.copy(Logs.operators));
            };
            newTemplateScope.selectMethod = function (isSMS) {
                newTemplateScope.templateNew.isSMS = isSMS;
            };
            newTemplateScope.newTemplateSubmit = function (templateNew) {
                newTemplateScope.submitted = true;
                templateNew.eventList = CommonService.getSelectedEvents(newTemplateScope.events);
                templateNew.type = newTemplateScope.selectedTab.type ;
                if(newTemplateScope.selectedTab.type ==='groovy') {
                    templateNew.templateText = editor.getValue();
                }
                var req = angular.copy(templateNew);
                req.operatorId = newTemplateScope.templateNew.operator.id;
                delete req["operator"];
                var formValidate = CommonService.templateFormValidate(newTemplateScope.templateNew);
                if (formValidate) {
                    TemplateService.save(req, function (response) {
                        if(response.code ==0 ) {

                            modal.$promise.then(modal.hide);
                            var upReq = {};
                            upReq.templateText = response.templateText;
                            LogService.updateMsgTemplate(upReq, function (response) {
                                loadIncomingPage($scope.incoming.page);
                            });
                        }
                    });
                }
            };
            newTemplateScope.submitWithoutValidate = function () {
                newTemplateScope.submitted = true;

                newTemplateScope.templateNew.eventList= CommonService.getSelectedEvents(newTemplateScope.events);
                newTemplateScope.templateNew.sampleText = '';
                newTemplateScope.templateNew.type = newTemplateScope.selectedTab.type ;
                if(newTemplateScope.selectedTab.type ==='groovy') {
                    newTemplateScope.templateNew.templateText = editor.getValue();
                }
                var req = angular.copy(newTemplateScope.templateNew);
                req.operatorId = newTemplateScope.templateNew.operator.id;
                delete req["operator"];
                var formValidate = CommonService.templateFormValidate(newTemplateScope.templateNew);
                if (formValidate) {
                    TemplateService.save(req, function (response) {
                        if(response.code ==0 ) {

                            modal.$promise.then(modal.hide);
                            var upReq = {};
                            upReq.templateText = response.templateText;
                            LogService.updateMsgTemplate(upReq, function (response) {
                                loadIncomingPage($scope.incoming.page);
                            });
                        }

                    });
                }
            };
            newTemplateScope.setTempType = function (templateType) {
                var temp = templateType.split(' ');
                newTemplateScope.templateType = temp[1];
                newTemplateScope.events = [];
                newTemplateScope.templateNew.method = 'SMS';
                newTemplateScope.templateNew.destination = '';
                newTemplateScope.eventDetailList = angular.copy($scope.eventList);

            };
            newTemplateScope.validate = function (template, sample) {
                newTemplateScope.submitValidation = true;

                if(newTemplateScope.selectedTab.type ==='groovy'){
                    template = editor.getValue();
                    if (template && sample) {
                        TemplateService.validateGroovy({'template': template, 'sample': sample}, function (response) {

                            if (response.err) {
                                newTemplateScope.templateNew.isValidTemplate = false;
                                newTemplateScope.groovyError = response.err
                            }
                            else {
                                newTemplateScope.groovyGroups =  response.res;
                                newTemplateScope.templateNew.isValidTemplate = true;
                            }
                            $timeout(function () {
                                $( "#groovyValue" ).click();
                            },500)

                        });
                    }
                    else if (!template){
                        newTemplateScope.isGroovyEmpty =true;
                    }
                }
                else{
                    if (template && sample) {
                        TemplateService.validate({'template': template, 'sample': sample}, function (response) {

                            if(response){
                                newTemplateScope.groups= response;
                                newTemplateScope.templateNew.isValidTemplate = true;
                            }
                            else{
                                newTemplateScope.templateNew.isValidTemplate = false;
                            }

                        });
                    }
                }

            };

            newTemplateScope.templateNew.groups = [];
            var myRegexp = /\(\?\<(.*?)\>/mg;

            newTemplateScope.$watch('templateNew.template', function (newVal, oldVal) {

                var match = myRegexp.exec(newVal);
                if (match) {
                    newTemplateScope.templateNew.groups.push(match[1]);
                }

            }, true);

            newTemplateScope.setEvent = function (event) {
                if (newTemplateScope.events.indexOf(event) > -1) {
                    newTemplateScope.events.splice(newTemplateScope.events.indexOf(event), 1);
                }
                else {
                    newTemplateScope.events.push(event);
                }

            };

            modal = $modal({scope: newTemplateScope, templateUrl: "views/template/new.html", show: true,backdrop: 'static'});

        }
        function editTemplate(template) {

            var editTemplateScope = $scope.$new(true); //created isolated scope to the edit view

            editTemplateScope.templateEdit = angular.copy(template);
            editTemplateScope.templateEdit.isValidTemplate = false;
            editTemplateScope.countries = angular.copy(Logs.countries);
            editTemplateScope.operators = angular.copy(Logs.operators);
            editTemplateScope.types = angular.copy(Logs.types);
            editTemplateScope.templateEdit.method = template.method || 'SMS';
            editTemplateScope.submitted = false;
            editTemplateScope.submitValidation = false;
            editTemplateScope.selectedEvent = '';
            editTemplateScope.eventDetailList = angular.copy($scope.eventList);
            editTemplateScope.events = CommonService.getModifiedEvents(editTemplateScope.templateEdit.eventList);
            editTemplateScope.tabs = [
                {title: 'REGEX Template',active: true, type: 'regex'},
                {title: 'Groovy Script', active: false, type: 'groovy'}
            ];
            editTemplateScope.settings = {
                scrollableHeight: '200px',
                scrollable: true,
                enableSearch: false
            };
            editTemplateScope.isGroovyEmpty = false;
            editTemplateScope.selectedTab = editTemplateScope.tabs[0];
            if(editTemplateScope.templateEdit.type){
                angular.forEach(editTemplateScope.tabs, function (tab) {
                    if(tab.type === editTemplateScope.templateEdit.type){
                        tab.active = true;
                        editTemplateScope.selectedTab = tab;
                    }
                    else{
                        tab.active = false;
                    }

                });
            }
            editTemplateScope.tabClick = function (index) {
                angular.forEach(editTemplateScope.tabs, function (tab) {
                    tab.active = false;
                });
                editTemplateScope.selectedTab = editTemplateScope.tabs[index];
                editTemplateScope.tabs[index].active = true;
                $timeout(function () {
                    editor.getDoc().setValue(editTemplateScope.templateEdit.templateText);
                },500)

            };

           /* if(editTemplateScope.templateEdit.operator.country.id){
                editTemplateScope.operators= CommonService.getRelevantOperators(editTemplateScope.templateEdit.operator.country.id,angular.copy(Logs.operators));
            }*/

            editTemplateScope.selectCountry = function (id) {
                editTemplateScope.operators= CommonService.getRelevantOperators(id,angular.copy(Logs.operators));
            };

            editTemplateScope.editTemplateSubmit = function (templateAfterEdit) {
                editTemplateScope.submitted = true;
                templateAfterEdit.eventList=CommonService.getSelectedEvents(editTemplateScope.events);
                templateAfterEdit.type = editTemplateScope.selectedTab.type ;
                if(editTemplateScope.selectedTab.type ==='groovy') {
                    templateAfterEdit.templateText = editor.getValue();
                }
                var req = angular.copy(templateAfterEdit);
                req.operatorId = templateAfterEdit.operator.id;
                delete req["operator"];
                var formValidate = CommonService.templateFormValidate(templateAfterEdit);
                if (formValidate) {
                    TemplateService.update(req, function (response) {
                        if(response.code ==0 ) {

                            loadIncomingPage($scope.incoming.page);
                            modalEdit.$promise.then(modalEdit.hide);
                            var upReq = {};
                            upReq.templateText = response.templateText;
                            LogService.updateMsgTemplate(upReq, function (response) {

                            });
                        }
                    });
                }

            };

            editTemplateScope.submitWithoutValidate = function () {
                editTemplateScope.submitted = true;
                editTemplateScope.templateEdit.eventList=CommonService.getSelectedEvents(editTemplateScope.events);
                editTemplateScope.templateEdit.sampleText = '';
                editTemplateScope.templateEdit.type  = editTemplateScope.selectedTab.type ;
                if(editTemplateScope.selectedTab.type ==='groovy') {
                    editTemplateScope.templateEdit.templateText = editor.getValue();
                }
                var req = angular.copy(editTemplateScope.templateEdit);
                req.operatorId = editTemplateScope.templateEdit.operator.id;
                delete req["operator"];
                var formValidate = CommonService.templateFormValidate(editTemplateScope.templateEdit);
                if (formValidate) {
                    TemplateService.update(req, function (response) {
                        if(response.code ==0 ) {
                            loadIncomingPage($scope.incoming.page);
                            modalEdit.$promise.then(modalEdit.hide);
                            var upReq = {};
                            upReq.templateText = response.templateText;
                            LogService.updateMsgTemplate(upReq, function (response) {

                            });
                        }
                    });
                }
            };

            editTemplateScope.$watch('templateEdit.templateText', function (oldVal, newVal) {

                editTemplateScope.templateEdit.isValidTemplate = false;

            });

            editTemplateScope.validate = function (template, sample) {
                editTemplateScope.submitValidation = true;
                if(editTemplateScope.selectedTab.type ==='groovy'){
                    template = editor.getValue();
                    if (template && sample) {
                        TemplateService.validateGroovy({'template': template, 'sample': sample}, function (response) {

                            if (response.err) {
                                editTemplateScope.templateEdit.isValidTemplate = false;
                                editTemplateScope.groovyError = response.err
                            }
                            else {
                                editTemplateScope.groovyGroups =  response.res;
                                editTemplateScope.templateEdit.isValidTemplate = true;
                            }
                            $timeout(function () {
                                $( "#groovyValue" ).click();
                            },500)

                        });
                    }
                    else if (!template){
                        editTemplateScope.isGroovyEmpty =true;
                    }
                }
                else{
                    if (template && sample) {
                        TemplateService.validate({'template': template, 'sample': sample}, function (response) {

                            if(response){
                                editTemplateScope.groups= response;
                                editTemplateScope.templateEdit.isValidTemplate = true;
                            }
                            else{
                                editTemplateScope.templateEdit.isValidTemplate = false;
                            }

                        });
                    }
                }


            };
            editTemplateScope.setTempType = function (templateType) {
                var temp = templateType.split(' ');
                editTemplateScope.templateType = temp[1];
                editTemplateScope.events = [];
                editTemplateScope.templateEdit.method = 'SMS';
                editTemplateScope.templateEdit.destination = '';
                editTemplateScope.eventDetailList = angular.copy($scope.eventList);

            };
            editTemplateScope.setEvent = function (event) {
                if (editTemplateScope.events.indexOf(event) > -1) {
                    editTemplateScope.events.splice(editTemplateScope.events.indexOf(event), 1);
                }
                else {
                    editTemplateScope.events.push(event);
                }

            };

            modalEdit = $modal({scope: editTemplateScope, templateUrl: "views/template/edit.html", show: true,backdrop: 'static'});
            if(editTemplateScope.selectedTab.type ==='groovy'){
                $timeout(function () {
                    editor.getDoc().setValue(editTemplateScope.templateEdit.templateText);
                },500)
            }

        }

        $scope.addNewTemplate = function (log) {
            CommonService.setLogData(log);
            templateNew(log);

        };
        $scope.viewTemplate = function(log){

                editTemplate(log.template);

        };
        $scope.openSubscriber = function (imei) {
            $location.path('/subscribers/'+imei+'/gsm');
        };
        $scope.getPlacement= function (index) {
            if(15<index){
                return 'top';
            }
            else{
                return "bottom";
            }

        };
        $scope.reloadContent = function (logType) {

            if (logType === 'incoming') {
                loadIncomingPage($scope[logType].page);
            }
            else if (logType === 'taskflows') {
                loadSbsReportData($scope[logType].page);
            }
            else if (logType === 'outgoing') {
                loadOutgoingPage($scope[logType].page);
            }
            else {
                loadCdrActivityPage($scope[logType].page);
            }
        };
        $scope.loadOperator = function(message){

            if (message.imei) {
                SubscriberService.findSubscriber({"imeiNo": message.imei}, '', function (response) {
                    message.subscriber = response;
                    if (message.subscriber.operatorId) {
                        OperatorService.viewOperatorById({"id": message.subscriber.operatorId}, function (response) {
                            message.subscriber.operator = response;
                        });
                    }
                });
            }
            else {
                message.subscriber = {};
                message.subscriber.operator = {};
            }
            mapTemplate();

        };
        $scope.changeOrder =function (type,action,sortBy) {
            if(type ==='ascending'){
                $scope[action].isAscending = true;
                $scope[action].isDescending = false;
                $scope[action].orderType = 'asc';
                $scope[action].sortBy = sortBy;

            }
            else{
                $scope[action].isAscending = false;
                $scope[action].isDescending = true;
                $scope[action].orderType = 'desc';
                $scope[action].sortBy = sortBy;

            }
            if (action === 'incoming') {
                loadIncomingPage($scope[action].page);
            }
            else if (action=="outgoing") {
                loadOutgoingPage($scope[action].page);
            }
            else if(action=="taskflows"){
                loadSbsReportData($scope[action].page);
            }
            else{
                loadCdrActivityPage($scope[action].page);
            }
        };

        //sbs transaction report functions

        $scope.taskflows.sbsTransactionData = {};
        $scope.export_action={};
        $scope.page=0;
        /*$scope.sbsTransactionData=   [
         {
         "id":13554548456,
         "date":1496113557486,
         "imei":1644937578,
         "name":"Main Balance",
         "sbsTransactionKey":"31545454896698",
         "isSuccessed":false,
         "message":"Time out",

         },
         {
         "id":13554548654,
         "date":1496113557566,
         "imei":1644937578,
         "name":"VAS Query",
         "sbsTransactionKey":"31545454896699",
         "isSuccessed":true,
         "message":"Time out",

         }
         ];*/

        $scope.selectCountry = function (id) {
            CommonService.setCountry(id);
            $scope.operators = angular.copy(sbsReport.operators);
            if (id) {
                $scope.operators = CommonService.getRelevantOperators(id, angular.copy(sbsReport.operators));
            }
        };



        if($scope.filterOption.countryId){
            $scope.operators = CommonService.getRelevantOperators($scope.filterOption.countryId,angular.copy(sbsReport.operators));
        }

        function validateSearchData() {

            var isValid = true;
            $scope.filterError = "";
            if ($scope.filterOption.toDate) {
                if (!$scope.filterOption.fromDate) {
                    isValid = false;
                    $scope.filterError = "From date is required";
                }
                else if (!(moment($scope.filterOption.fromDate, "YYYY-MM-DD").isBefore($scope.filterOption.toDate, "YYYY-MM-DD") || moment($scope.filterOption.fromDate, "YYYY-MM-DD").isSame($scope.filterOption.toDate, "YYYY-MM-DD"))) {
                    isValid = false;
                    $scope.filterError = "Invalid to date";
                }

            }
            else if($scope.filterOption.searchType =='' && ($scope.filterOption.searchText !='')){
                isValid = false;
                $scope.filterError = "Exact search type required for text";

            }
            else if($scope.filterOption.searchType !='' && $scope.filterOption.searchType !=null && ($scope.filterOption.searchText==''|| $scope.filterOption.searchText==null )){
                isValid = false;
                $scope.filterError = "Invalid Search Text";
            }
            else if($scope.filterOption.searchType =='id'&& !(Number.isInteger(parseInt($scope.filterOption.searchText))) ){
                isValid = false;
                $scope.filterError = "Integer value is required for  the transaction id";
            }
            if(isValid){
                $scope.filterError = "";
            }
            return isValid;


        }


        function mapSBSSubscriber() {
            angular.forEach($scope.taskflows.sbsTransactionData, function (transaction) {
                transaction.subscriber = {};
                if (transaction.imei) {
                    SubscriberService.findSubscriber({"imeiNo":  transaction.imei}, '', function (response) {
                        transaction.subscriber = response;
                        if (transaction.subscriber.operatorId) {
                            OperatorService.viewOperatorById({"id": transaction.subscriber.operatorId}, function (response) {
                                transaction.subscriber.operator = response;
                            });
                        }
                    });
                }
                else {
                    transaction.subscriber = {};
                    transaction.subscriber.operator = {};
                }
            });
        }


        $scope.search = function () {
            if (validateSearchData()) {
                loadSbsReportData();
            }
        };

        $scope.exportAction = function(type){
            $scope.export_action =type;
            switch($scope.export_action){
                case "pdf": $scope.$broadcast("export-pdf", {});
                    break;
                case "excel": $scope.$broadcast("export-excel", {});
                    break;
                case "doc": $scope.$broadcast("export-doc", {});
                    break;
                case "csv": $scope.$broadcast("export-csv", {});
                    break;
                default: console.log("no event caught");
            }
        };
        $scope.generatePDF = function () {
            var pdf = new jsPDF('p', 'pt', 'a4');
            pdf.addHTML(document.body, function() {
                pdf.save('web.pdf');
            });
        };
        var detailViewScope, modal;
        $scope.detailView = function(transaction){
            detailViewScope = $scope.$new(true);
            detailViewScope.transaction = transaction;
            detailViewScope.transactionDetail = {};
            if(!!transaction.id){
                ReportService.viewTransactionById({'id':transaction.id}, function (response) {
                    $scope.transactionDetail = response;
                });
                modal = $modal({scope: detailViewScope, templateUrl: "views/report/sbsTransactionDetailView.html", show: true});
            }

        };
        $scope.openTransactionDetail  = function(data){
            CommonService.setTransactionData(data);
            CommonService.setWorkflowNavigationFrom('log/taskflows');
            $location.path('/taskflows/'+data.id+'/step=0');
        };
        loadSbsReportData(0);
        $scope.testPdf= function(){
            $('#customers').tableExport({type:'pdf',escape:'false'});
        };
        $scope.loadSbsNextPage = function (id) {
            loadSbsReportData(id);
        };

        $scope.pageSbsNavigation = function (type) {
            if (type === "prev") {
                $scope.page = $scope.page - 1;
                loadSbsReportData($scope.page);
            }
            else {
                $scope.page = $scope.page + 1;
                loadSbsReportData($scope.page);
            }
        };
        $scope.navigateToWorkflow = function (sbsTransactionKey) {
            CommonService.setWorkflowNavigationFrom('log/incoming');

            ReportService.viewTransactionLogKeyById({'id':sbsTransactionKey}, function (response) {
                $location.path('/taskflows/'+response.id+'/step=0');
            });

        };
       /* $scope.viewLocation = function(longitude,latitude){
            var url="http://maps.google.com/maps?z=12&t=m&q=loc:"+latitude+"+"+longitude;

            window.open(url,'_blank');

        };*/
        var mapScope;
        $scope.viewLocation = function(longitude,latitude){
            /* var url="http://maps.google.com/maps?z=12&t=m&q=loc:"+latitude+"+"+longitude;

             window.open(url,'_blank');*/
            mapScope = $scope.$new(true);
            mapScope.longitude = parseFloat(longitude);
            mapScope.latitude = parseFloat(latitude);
            mapScope.latlng = [mapScope.latitude,mapScope.longitude];
            mapScope.geopos={};
            mapScope.geopos.lat = mapScope.latitude;
            mapScope.geopos.lng = mapScope.longitude;

            mapScope.render = true;
            modal = $modal({scope: mapScope, templateUrl: "views/googleMapPopup.html",
                resolve: {
                    lat: function () {
                        return mapScope.longitude;
                    },
                    lng: function () {
                        return mapScope.latitude;
                    }
                },
                show: true,backdrop: 'static'});

            NgMap.getMap().then(function (map) {
                google.maps.event.trigger(map, "resize");
            });
        };

        var modal;
        $scope.loadMobileContent = function (content,type) {
            var jsonScope = $scope.$new(true);
            jsonScope.jsonData = $rootScope.JSONParser(content);
            jsonScope.type = type;
            var json = jsonScope.jsonData;
            jsonScope.obj = {data: json, options: { mode: 'view' , expanded:true, search:false}};
            jsonScope.pretty = function (obj) {
                return angular.toJson(obj, true);
            };
            jsonScope.editorLoaded  = function (instance) {
                instance.expandAll();
            };

            var modal = $modal({scope: jsonScope, templateUrl: "views/log/cdrMobileContent.html", show: true,backdrop: 'static'});
        };
        $scope.viewErrorContent =function(content, type){
            var jsonScope = $scope.$new(true);

            jsonScope.jsonData = [];
            if(content){
                var temp = content.split('|');
                jsonScope.jsonData =temp;
            }
            jsonScope.obj = {data: jsonScope.jsonData, options: { mode: 'view' , expanded:true, search:false}};
            jsonScope.pretty = function (obj) {
                return angular.toJson(obj, true);
            };
            jsonScope.editorLoaded  = function (instance) {
                instance.expandAll();
            };
            jsonScope.type = type;
            var modal = $modal({scope: jsonScope, templateUrl: "views/log/cdrErrorWarningContent.html", show: true,backdrop: 'static'});
        };
        $scope.getRowspanValue=function(valueset){
          var count = 0;
            count =valueset.length;

          angular.forEach(valueset, function(value){
              if(value.cdrLogDetails.length>1){
                  count = count+value.cdrLogDetails.length;
              }
          });

          return count;
        };
        $scope.getCDRFiles = function (cdrFiles) {
            var files= cdrFiles;
            if(cdrFiles && cdrFiles[0].cdrLogDetails){
                cdrFiles[0].cdrLogDetails.slice(1);
            }
            return cdrFiles;
        };
        $scope.takeAction = function(log){
            var takeActionScope = $scope.$new(true);
            takeActionScope.log = log;
            takeActionScope.aveCDRAction = function(){
                dashBoardService.saveEventAction(req, function (response) {
                    $rootScope.notifications.alertCount = $rootScope.notifications.alertCount - 1;
                });
            }

            var modal = $modal({scope: takeActionScope, templateUrl: "views/log/cdrActivityLog.html", show: true,backdrop: 'static'});
        };
        $scope.takeAction = function(log,action){
            var takeActionScope = $scope.$new(true);
            takeActionScope.log = log;
            if(action){
                takeActionScope.actionDetails =action;
                takeActionScope.type= "EDIT";
            }
            else{
                takeActionScope.actionDetails ={};
                takeActionScope.type= "ADD";
            }

            takeActionScope.saveCDRAction = function(){
                var req = {} ;
                req = takeActionScope.actionDetails;
                req.subscriberEvent = {
                    "id": log.eventDetails.id
                };

                dashBoardService.saveEventAction(req, function (response) {
                    $rootScope.notifications.alertCount = $rootScope.notifications.alertCount - 1;
                    modal.$promise.then(modal.hide);
                    loadCdrActivityPage($scope['cdrActivity'].page);
                });
            };

            var modal = $modal({scope: takeActionScope, templateUrl: "views/log/cdrTakeAction.html", show: true,backdrop: 'static'});
        }
    }]);
