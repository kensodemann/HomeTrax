angular.module('app')
  .controller('trxAboutCtrl', function($scope) {
  	$scope.currentVersion = 'pre-0.5';
  	
    $scope.versions = [{
      id: "Pre_0_5",
      name: "Pre-Release 0.5",
      description: "This is the first version to include any type of meaningful user interaction.  " +
      "This version also includes the start of some styling.",
      features: [
        "Styling",
        "Default admin user",
        "User creation",
        "My Profile",
        "This About page"
      ]
    }];
  });