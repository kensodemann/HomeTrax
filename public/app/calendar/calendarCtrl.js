angular.module('app')
  .controller('calendarCtrl', function($scope) {
    $scope.message = "Hello World from the Angular Calendar!!";
    $scope.subtext = "This is some more text.";
    $scope.editMode = '';

    $scope.messageClicked = function() {
      $scope.editMode = 'message';
    };

    $scope.subtextClicked = function() {
      $scope.editMode = 'subtext';
    };

    $scope.handleChange = function() {
      $scope.editMode = '';
    }
  });