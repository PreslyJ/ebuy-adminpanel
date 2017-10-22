
(function(){
//export html table to pdf, excel and doc format directive
    var exportTable = function(){
        var link = function($scope, elm, attr){
            $scope.$on("export-pdf", function(e, d){
                elm.tableExport({type:"pdf", escape:"false",pdfFontSize:"7",escape:"false",pdfLeftMargin:2,htmlContent :true,tableLayout:true,
                    tableName:"SRS Report",jspdf: {orientation: '2',
                        format: 'a3',
                        margins: {left:10, right:10, top:20, bottom:20},
                        autotable: {styles: {fillColor: 'inherit',
                            textColor: 'inherit'},
                            tableWidth: 'auto'}
                    }});
            });
            $scope.$on("export-excel", function(e, d){
                elm.tableExport({type:"excel", escape:false});
            });
            $scope.$on("export-doc", function(e, d){
                elm.tableExport({type: "doc", escape:false});
            });
            $scope.$on("export-csv", function(e, d){
                elm.tableExport({type: "csv", escape:false});
            });
        };
        return {
            restrict: "C",
        link: link
    }
    };
    angular
        .module("CustomDirectives", [])
    .directive("exportTable", exportTable);
})();