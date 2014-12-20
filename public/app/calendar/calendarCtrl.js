(function() {
  'use strict';

  angular.module('app.calendar').controller('calendarCtrl', CalendarCtrl);

  function CalendarCtrl($scope, $log, $aside, calendarData, eventEditor) {
    var self = this;

    self.eventSources = [{
      events: function(start, end, timezone, callback) {
        calendarData.load().then(function() {
          asideScope.eventCategories = calendarData.eventCategories();
          callback(calendarData.events());
        });
      }
    }];

    var asideScope = $scope.$new(true);
    var aside = $aside({
      template: '/partials/calendar/templates/options',
      backdrop: 'static',
      show: false,
      scope: asideScope
    });
    asideScope.title = 'Calendar Options';

    asideScope.$watch('showOnlyMine', function(onlyMine, previousValue) {
      if (onlyMine !== previousValue) {
        calendarData.limitToMine(onlyMine);
        $scope.calendar.fullCalendar('refetchEvents');
      }
    });

    asideScope.categoryChanged = function(cat) {
      if (cat.include) {
        calendarData.includeCategory(cat.name);
      } else {
        calendarData.excludeCategory(cat.name);
      }
      $scope.calendar.fullCalendar('refetchEvents');
    };

    self.showOptions = function() {
      aside.$promise.then(aside.show);
    };

    self.uiConfig = {
      calendar: {
        editable: true,
        timezone: 'local',
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: dayClicked,
        eventClick: eventClicked,
        eventDrop: eventDropped
      }
    };

    function eventDropped() {
      $log.log('You dropped the bomb on me');
    }

    function dayClicked(day) {
      var event = new calendarData.newEvent(day);
      eventEditor.initialize($scope.calendar);
      eventEditor.open(event, 'create');
    }

    function eventClicked(event) {
      eventEditor.initialize($scope.calendar);
      eventEditor.open(event, 'edit');
    }
  }
}());