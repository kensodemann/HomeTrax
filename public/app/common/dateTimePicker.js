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
          defaultDate: '@',
          pickTime: '@'
        },
        link: function(scope, elem, attrs, ctrl) {
          elem.datetimepicker({
            pick12HourFormat: scope.pick12HourFormat,
            language: scope.language,
            useCurrent: scope.useCurrent,
            defaultDate: scope.defaultDate,
            pickTime: scope.pickTime !== 'false'
          });

          scope.$watch('$parent.' + attrs.ngModel, function(value) {
            var picker = elem.data('DateTimePicker');
            var pickerDateTime = picker.getDate().format(picker.format);
            if (pickerDateTime !== value) {
              picker.setDate(value);
            }
          });

          scope.$on('$destroy', function() {
            var picker = elem.data('DateTimePicker');
            if (picker) {
              picker.destroy();
            }
          });
        }
      };
    }
  ]);