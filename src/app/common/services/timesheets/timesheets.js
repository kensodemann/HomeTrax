(function() {
  'use strict';

  angular.module('homeTrax.common.services.timesheets', [
    'homeTrax.auth.identity',
    'homeTrax.common.resources.Timesheet',
    'homeTrax.common.services.dateUtilities'
  ]).factory('timesheets', timesheets);

  function timesheets($q, Timesheet, identity, dateUtilities) {
    var timesheetCache;
    var previousUser;

    return {
      getCurrent: getCurrentTimesheet,
      refresh: getAllTimesheets,

      get all() {
        if (!timesheetCache || previousUser !== identity.currentUser) {
          getAllTimesheets();
        }

        return timesheetCache;
      }
    };

    function getAllTimesheets() {
      previousUser = identity.currentUser;
      timesheetCache = Timesheet.query();
    }

    function getCurrentTimesheet() {
      var dfd = $q.defer();
      var today = dateUtilities.removeTimezoneOffset(new Date());
      var weekEndDate = dateUtilities.weekEndDate(today).toISOString().substring(0, 10);

      var ts = findCurrentInCache(weekEndDate);
      if (ts) {
        dfd.resolve(ts);
      } else {
        getCurrentFromDataService(dfd, weekEndDate);
      }

      return dfd.promise;
    }

    function findCurrentInCache(weekEndDate) {
      var ts;
      if (timesheetCache && identity.currentUser === previousUser) {
        ts = _.find(timesheetCache, function(t) {
          return t.endDate === weekEndDate;
        });
      }

      return ts;
    }

    function getCurrentFromDataService(dfd, weekEndDate) {
      Timesheet.query({
        endDate: weekEndDate
      }, success, error);

      function success(matching) {
        if (matching.length === 0) {
          var ts = new Timesheet({
            endDate: weekEndDate
          });
          ts.$save();
          dfd.resolve(ts);
        } else {
          dfd.resolve(matching[0]);
        }
      }

      function error() {
      }
    }
  }
}());
