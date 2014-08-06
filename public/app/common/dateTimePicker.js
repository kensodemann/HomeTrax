angular.module('app')
  .directive('dateTimePicker', ['$rootScope',
    function($rootScope) {
      // This directive was taken from: https://gist.github.com/eugenekgn/f00c4d764430642dca4b
      // and then modified to actually work
      return {
        require: '?ngModel',
        restrict: 'AE',
        scope: {
          pick12HourFormat: '@',
          language: '@',
          useCurrent: '@',
          location: '@',
          defaultDate: '@'
        },
        link: function(scope, elem, attrs, ctrl) {
          elem.datetimepicker({
            pick12HourFormat: scope.pick12HourFormat,
            language: scope.language,
            useCurrent: scope.useCurrent,
            defaultDate: scope.defaultDate
          });

          ctrl.$formatters.unshift(function(modelValue) {
            var dateFormat = attrs.dateTimePicker || 'YYYY/MM/DD';
            scope = scope;
            if (!modelValue) return "";
            var retVal = moment(modelValue).format(dateFormat);
            return retVal;
          });
        }
      };
    }
  ]);