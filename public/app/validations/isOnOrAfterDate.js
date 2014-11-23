(function() {
  'use strict';

  angular.module('app').directive('isOnOrAfterDate', IsOnOrAfterDate);

  function IsOnOrAfterDate() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: link
    };

    function link(scope, elem, attrs, ctrl) {
      var dateFormat = scope.$parent.dateFormat || 'MM/DD/YYYY';
      var dateTimeFormat = scope.$parent.dateTimeFormat || 'MM/DD/YYYY h:mm A';

      scope.$watch(attrs.ngModel, function(newValue) {
        validate(newValue, attrs.isOnOrAfterDate);
      });

      attrs.$observe('isOnOrAfterDate', function(newValue) {
        validate(ctrl.$modelValue, newValue);
      });

      function validate(date1, date2) {
        var vDate = moment(date1, [dateFormat, dateTimeFormat]);
        var tDate = moment(date2, [dateFormat, dateTimeFormat]);
        ctrl.$setValidity('isOnOrAfterDate', !vDate.isBefore(tDate));
      }
    }
  }
}());