(function() {
  'use strict';

  angular.module('homeTrax.timesheets.list', [
    'ui.router',
    'homeTrax.common.services.timesheets',
    'homeTrax.common.services.messageDialog'
  ]).controller('timesheetListController', TimesheetListController)
    .config(function($stateProvider) {
      $stateProvider.state('app.timesheets.list', {
        url: '/list',
        views: {
          timesheetView: {
            templateUrl: 'app/timesheets/list/timesheetList.html',
            controller: 'timesheetListController',
            controllerAs: 'controller'
          }
        }
      });
    });

  function TimesheetListController(timesheets, messageDialog) {
    var controller = this;

    controller.timesheets = timesheets.all;

    activate();

    function activate() {
      controller.timesheets.$promise.catch(displayError);

      function displayError(res) {
        messageDialog.error('Error Getting Timesheets', res.data.reason);
      }
    }
  }
}());
