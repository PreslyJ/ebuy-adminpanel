app.directive('dataTable', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      angular.element(element).DataTable();
    }
  };
});

