(function() {
  'use strict';

  angular.module('homeTrax.common.validations').directive('matchesValue', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, elem, attrs, ctrl) {
        function validate(value1, value2) {
          ctrl.$setValidity('matchesValue', value1 === value2);
        }

        scope.$watch(attrs.ngModel, function(newValue) {
          validate(newValue || '', attrs.matchesValue || '');
        });

        attrs.$observe('matchesValue', function(newValue) {
          validate(newValue || '', ctrl.$modelValue || '');
        });
      }
    };
  });
}());