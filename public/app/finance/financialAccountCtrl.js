// In combination with this: http://www.bennadel.com/blog/2450-using-ngcontroller-with-ngrepeat-in-angularjs.htm
// This could be used to do an editable table (I am thinking aobut for the account transactions, etc.)
angular.module('app')
  .controller('financialAccountCtrl', function($scope, $location) {
    $scope.message = "Hello World from the Angular Financial Account Controller!!";
    $scope.subtext = "This is some more text.";
    $scope.accountName = ($location.search()).acct;

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