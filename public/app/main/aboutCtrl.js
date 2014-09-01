angular.module('app')
  .controller('aboutCtrl', function($scope) {
    $scope.currentVersion = 'pre-0.6';

    $scope.versions = [{
      id: "Pre_0_6",
      name: "Pre-Release 0.6",
      releaseDate: moment("2014/08/31", "YYYY/MM/DD"),
      description: "This version adds the calendar and improves general interaction and editting.",
      features: [
        "Editor Coding Improvements",
        "Calendar of Events"
      ],
      bugFixes: [
        "No longer displaying stale changes in master data when editing is cancelled",
        "Allow entry of initial password when creation new users",
      ]
    }, {
      id: "Pre_0_5",
      name: "Pre-Release 0.5",
      releaseDate: moment("2014/06/14", "YYYY/MM/DD"),
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