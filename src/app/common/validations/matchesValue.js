(function() {
  'use strict';

  angular.module('homeTrax.common.validations.matchesValue', [])
    .directive('matchesValue', function() {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ngModelController) {
          function validate(value1, value2) {
            ngModelController.$setValidity('matchesValue', value1 === value2);
          }

          scope.$watch(attrs.ngModel, function(newValue) {
            validate(newValue || '', attrs.matchesValue || '');
          });

          attrs.$observe('matchesValue', function(newValue) {
            validate(newValue || '', ngModelController.$modelValue || '');
          });
        }
      };
    });
}());