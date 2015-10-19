(function() {
  'use strict';

  angular.module('homeTrax.timesheets.current')
    .controller('currentTimesheetController', CurrentTimesheetController)
    .config(function($routeProvider) {
      $routeProvider.when('/timesheets/current', {
        templateUrl: 'app/timesheets/current/currentTimesheet.html',
        controller: 'currentTimesheetController',
        controllerAs: 'controller'
      });
    });

  function CurrentTimesheetController() {
    var controller = this;

    controller.dates = [
      new Date(2015, 9, 18),
      new Date(2015, 9, 19),
      new Date(2015, 9, 20),
      new Date(2015, 9, 21),
      new Date(2015, 9, 22),
      new Date(2015, 9, 23),
      new Date(2015, 9, 24)
    ];

    controller.tasks = [{
      _id: '88499584',
      sbvbTaskId: 'RFP14141',
      jiraTaskId: 'AA-101',
      name: 'Drink Coffee',
      seconds: 4392,
      isActive: true,
      task: {
        _id: '1234',
        name: 'Drink'
      }
    }, {
      _id: '99488593',
      sbvbTaskId: 'RFP14141',
      jiraTaskId: 'AA-102',
      name: 'Eat Cake',
      seconds: 5891,
      isActive: false,
      task: {
        _id: '1235',
        name: 'Eat'
      }
    }];
  }
}());