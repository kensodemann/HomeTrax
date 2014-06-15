// In combination with this: http://www.bennadel.com/blog/2450-using-ngcontroller-with-ngrepeat-in-angularjs.htm
// This could be used to do an editable table (I am thinking aobut for the account transactions, etc.)
// TODO: Move this to the account page before adding the calendar to this page.
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