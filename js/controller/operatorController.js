app.controller('operatorController', ['$scope', '$modal', 'OperatorService', 'Operators','CommonService','TemplateService','dashBoardService',function ($scope, $modal, OperatorService, Operators, CommonService,TemplateService,dashBoardService) {

    if (typeof Operators.countries !== 'undefined') {
        $scope.countries = Operators.countries;
    } else {
        return;
    }
    if (typeof Operators.operators !== 'undefined') {
        $scope.operators = Operators.operators;
    } else {
        return;
    }
    function loadPage() {
        OperatorService.view( function (response) {
            $scope.operators = response;
        });
    }


    var modalAddEdit;
    $scope.operatorAddEdit = function(type,operator){

        var operatorAddEditScope = $scope.$new(true);

        dashBoardService.loginDetails( function (response) {
            operatorAddEditScope.isPrivilegedUser = response.permissions.includes('assign self number');
            console.log('privilaged'+operatorAddEditScope.isPrivilegedUser);
        });
        operatorAddEditScope.submitForm = false;
        operatorAddEditScope.type= type;

        if(type === 'Edit'){
            var post_obj = {};
            Object.assign(post_obj, { "operator" : operator });
            Object.assign(post_obj, { "templateTypeId" : 3 });

            TemplateService.getTemplateByType(post_obj, function (response) {
                operatorAddEditScope.templates = response;
            });
            operatorAddEditScope.operatorAddEdit = angular.copy(operator);
        }
        else{
            operatorAddEditScope.operatorAddEdit = {};
            operatorAddEditScope.operatorAddEdit.operatorMNC = [];
            operatorAddEditScope.operatorAddEdit.serviceNo = [];
        }
        operatorAddEditScope.countries = Operators.countries;
        operatorAddEditScope.submitForm = false;
        operatorAddEditScope.details ={};
        operatorAddEditScope.details.mnc = '';
        operatorAddEditScope.details.no ='';
        function isNotExist(id){
            var  isNotExit = true;
            for(var i=0;i<operatorAddEditScope.operatorAddEdit.operatorMNC.length;i++){
                if(operatorAddEditScope.operatorAddEdit.operatorMNC[i].mnc ===id){
                    isNotExit =false;
                    break;
                }
            }
            return isNotExit;
        }
        function isServiceNoNotExist(id){
            var  isNotExit = true;
            for(var i=0;i<operatorAddEditScope.operatorAddEdit.serviceNo.length;i++){
                if(operatorAddEditScope.operatorAddEdit.serviceNo[i].no ===id){
                    isNotExit =false;
                    break;
                }
            }
            return isNotExit;
        }
        operatorAddEditScope.addMNC = function (mnc) {
            if (mnc && !!parseInt(mnc) && isNotExist(parseInt(mnc))) {
                operatorAddEditScope.operatorAddEdit.operatorMNC.push({"mnc": parseInt(mnc),active:true});
                operatorAddEditScope.details.mnc = '';
                mnc='';
            }
            else {
                operatorAddEditScope.details.mnc = '';
                mnc='';
            }

        };
        operatorAddEditScope.deleteMNC = function (opMnc) {
            if(type === "Add"){
                operatorAddEditScope.operatorAddEdit.operatorMNC.splice(operatorAddEditScope.operatorAddEdit.operatorMNC.indexOf(opMnc), 1);
            }
            else{
                opMnc.active =false;
            }

        };
        operatorAddEditScope.addService = function (no) {
            if (no && !!parseInt(no) && isServiceNoNotExist(parseInt(no))) {
                operatorAddEditScope.operatorAddEdit.serviceNo.push({"no":no});
                operatorAddEditScope.details.no = '';
                no='';
            }
            else {
                operatorAddEditScope.details.no = '';
                no='';
            }

        };
        operatorAddEditScope.deleteService = function (no) {
            operatorAddEditScope.operatorAddEdit.serviceNo.splice(operatorAddEditScope.operatorAddEdit.serviceNo.indexOf(no), 1);
        };
        operatorAddEditScope.operatorSubmit = function (operator) {
            operatorAddEditScope.submitForm = true;
            if (operatorAddEditScope.operatorAddEdit.country.id && operatorAddEditScope.operatorAddEdit.operatorName && operatorAddEditScope.operatorAddEdit.operatorMNC.length &&
                operatorAddEditScope.operatorAddEdit.serviceNo.length) {
                if(type === 'Edit'){
                    OperatorService.update(operator, function (response) {
                        if(response && response.resultCode && response.resultCode ===1014 ){

                        }
                        else{
                            loadPage();
                            modalAddEdit.$promise.then(modalAddEdit.hide);
                        }

                    });
                }
                else{
                    OperatorService.save(operator, function(response){
                        console.log(response)
                        loadPage();
                        modalAddEdit.$promise.then(modalAddEdit.hide);
                    });
                }

            }


        };

        modalAddEdit = $modal({scope: operatorAddEditScope, templateUrl: "views/operator/operatorAddEdit.html", show: true ,backdrop: 'static'});
    };
    function FilterOption() {
        this.countryId = CommonService.getCountry();
    }


    $scope.country = _.find($scope.countries,{id : CommonService.getCountry()});

    $scope.operatorDelete = function (operator) {
        $scope.selectedOperator = operator;
    };

    $scope.confirmDelete = function () {
        OperatorService.delete({'id': $scope.selectedOperator.id}, function () {
            $scope.operators.splice($scope.operators.indexOf($scope.selectedOperator), 1);
        });
    };

    $scope.selectCountry = function (country) {
        OperatorService.viewByFilter({'countryId':country.id}, function (response) {
            $scope.operators = response;
        });
    };
    $scope.$watchCollection("country", function(newVal, oldVal){
        if(newVal){
            CommonService.setCountry(newVal.id);
        }
        else{
            CommonService.setCountry(null);
        }
    });
    $scope.updateOperator = function(operator){
        OperatorService.update(operator, function (response) {
            loadPage();;
        });
    }

}]);
