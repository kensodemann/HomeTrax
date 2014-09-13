'use strict';

angular.module('app').directive('matchesValue', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(attrs.ngModel, function(newValue) {
        ctrl.$setValidity('matchesValue', newValue === attrs.matchesValue)
      });
    }
  };
});