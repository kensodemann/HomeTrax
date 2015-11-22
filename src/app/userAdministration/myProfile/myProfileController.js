(function() {
  'use strict';

  angular.module('homeTrax.userAdministration.myProfile', [
    'ngMessages',
    'ngRoute',
    'homeTrax.auth.identity',
    'homeTrax.common.resources.User',
    'homeTrax.common.services.notifier',
    'homeTrax.userAdministration.passwordEditor'
  ]).controller('myProfileController', MyProfileController)
    .config(function($routeProvider){
      $routeProvider.when('/userAdministration/myprofile', {
        templateUrl: 'app/userAdministration/myProfile/myProfile.html',
        controller: 'myProfileController',
        controllerAs: 'controller'
      });
    });

  function MyProfileController(User, identity, passwordEditor, notifier) {
    var controller = this;

    controller.model = undefined;
    controller.reset = reset;
    controller.save = saveUser;
    controller.openPasswordEditor = openPasswordEditor;

    activate();

    function reset() {
      fetchUserModel();
    }

    function saveUser() {
      controller.model.$save(success, error);

      function success() {
        notifier.notify('Profile modifications saved successfully');
      }

      function error(err) {
        notifier.error(err.data.reason);
      }
    }

    function openPasswordEditor() {
      identity.get().then(function(user) {
        passwordEditor.open(user._id);
      });
    }

    function activate() {
      fetchUserModel();
    }

    function fetchUserModel() {
      identity.get().then(function(user) {
        controller.model = User.get({
          id: user._id
        });
      });
    }
  }
}());