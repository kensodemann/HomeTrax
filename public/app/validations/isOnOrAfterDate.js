'use strict';

angular.module('app').directive('isOnOrAfterDate', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, elem, attrs, ctrl) {
        var dateFormat = scope.$parent.dateFormat || 'MM/DD/YYYY';
        var dateTimeFormat = scope.$parent.dateTimeFormat || 'MM/DD/YYYY h:mm A';
        scope.$watch(attrs.ngModel, function(newValue) {
          var vDate = moment(newValue, [dateFormat, dateTimeFormat]);
          var tDate = moment(attrs.isOnOrAfterDate, [dateFormat, dateTimeFormat]);
          ctrl.$setValidity('isOnOrAfterDate', !vDate.isBefore(tDate));
        });
      }
    };
  }
);