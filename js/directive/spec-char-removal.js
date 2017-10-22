
app.directive('specCharRemoval',function(){

    return {
         restrict :'A',
         require :'ngModel',
         link : function(scope,elements,attrs,ngModel){

             ngModel.$parsers.push(function(value){
                 if(value){
                     var formattedValue = value.replace(/[^a-zA-Z0-9-_. ]/g, "");
                     if(ngModel.$viewValue!==formattedValue){
                         ngModel.$setViewValue(formattedValue);
                         ngModel.$render();
                     }

                     return value;
                 }
                 return undefined;


             });

         }

    };
});
