'use strict'

angular.module('app')
  .controller('eventEditorCtrl', ['$scope', '$modalInstance', 'eventModel',
    function($scope, $modalInstance, eventModel) {
      initializeData();
      inintializeDates();

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
        eventModel.start = (eventModel.start) ? eventModel.start : moment().startOf('Day');
        eventModel.end = (eventModel.end) ? eventModel.end : moment().startOf('Day');
      }

      function initializeData() {
        $scope.model = eventModel;
        $scope.title = (eventModel._id) ? 'Edit Event' : 'New Event';
        $scope.errorMessage = '';
        $scope.dateFormat = 'MM/DD/YYYY h:mm A';
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