angular.module('app')
  .directive('dateTimePicker', ['$rootScope',
    function($rootScope) {
      // This directive was taken directly from: https://gist.github.com/eugenekgn/f00c4d764430642dca4b
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
            scope = scope;
            if (!modelValue) return "";
            var retVal = moment(modelValue).format('MM/DD/YYYY h:mm A');
            return retVal;
          });
        }
      };
    }
  ]);