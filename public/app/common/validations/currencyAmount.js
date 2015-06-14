(function() {
  'use strict';

  angular.module('app.core').directive('currencyAmount', currencyAmount);

  var CURRENCY_REGEXP = /^\-?\d*\.?\d{0,2}$/;

  function currencyAmount() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: link
    };

    function link(scope, element, attrs, ctrl) {
      ctrl.$validators.currencyAmount = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        return CURRENCY_REGEXP.test(viewValue);
      };
    }
  }
}());