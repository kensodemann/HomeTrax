'use strict'

angular.module('app')
  .controller('eventEditorCtrl', ['$scope', '$modalInstance', 'eventModel',
    function($scope, $modalInstance, eventModel) {
      initializeData();
      inintializeDates();
      initializeDataWatchers();

      $scope.cancel = function() {
        $modalInstance.dismiss();
      }

      $scope.ok = function() {
        eventModel.$save(function(event, response) {
          $modalInstance.close(event);
        }, function(response) {
          $scope.errorMessage = response.data.reason;
        });
      }

      $scope.validate = function() {
        validateRequiredFields();
      }

      function inintializeDates() {
        eventModel.start = stringifyDate((eventModel.start) ? eventModel.start : moment(moment().format('YYYY-MM-DD')).hour(8));
        eventModel.end = stringifyDate((eventModel.end) ? eventModel.end : moment(moment().format('YYYY-MM-DD')).hour(9));
      }

      function stringifyDate(d) {
        if (typeof d === 'string') {
          return d;
        }
        return d.format(($scope.model.allDay ? $scope.dateFormat : $scope.dateTimeFormat));
      }

      function datifyString(s) {
        if (typeof s !== 'string') {
          return s;
        }

        return moment(s, ($scope.model.allDay ? $scope.dateFormat : $scope.dateTimeFormat));
      }

      function initializeData() {
        $scope.model = eventModel;
        $scope.title = (eventModel._id) ? 'Edit Event' : 'New Event';
        $scope.errorMessage = '';
        $scope.dateTimeFormat = 'MM/DD/YYYY h:mm A';
        $scope.dateFormat = 'MM/DD/YYYY';
      }

      function initializeDataWatchers() {
        $scope.$watch('model.start', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            var n = datifyString(newValue);
            var o = datifyString(oldValue);
            var newEnd = datifyString(scope.model.end);
            newEnd.add(n - o);
            scope.model.end = stringifyDate(newEnd);
          }
        });

        $scope.$watch('model.allDay', function(newValue, oldValue, scope) {
          if (newValue && !oldValue) {
            scope.model.start = convertFormat(scope.model.start);
            scope.model.end = convertFormat(scope.model.end);
          } else if (!newValue && oldValue) {
            scope.model.start = setHour(scope.model.start, 8);
            scope.model.end = setHour(scope.model.end, 1);
          }
        });

        function convertFormat(d) {
          var newD = datifyString(d);
          return stringifyDate(newD);
        }

        function setHour(d, h) {
          var newD = datifyString(d);
          newD.hour(h);
          return stringifyDate(newD);
        }
      }

      function validateRequiredFields() {
        if (!$scope.model.title) {
          return $scope.errorMessage = 'Event Title is required';
        }

        if (!$scope.model.start) {
          return $scope.errorMessage = 'Start Date is required';
        }

        if (!$scope.model.end) {
          return $scope.errorMessage = 'End Date is required';
        }
      }
    }
  ]);