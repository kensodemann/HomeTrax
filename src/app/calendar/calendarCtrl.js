/* global angular */
(function() {
  'use strict';

  angular.module('app.calendar').controller('calendarCtrl', CalendarCtrl);

  function CalendarCtrl($scope, $aside, calendarData, calendarEventEditor) {
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
      template: 'app/calendar/templates/options.html',
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
      }
      else {
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
        timezone: false,
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: dayClicked,
        eventClick: eventClicked,
        eventDrop: saveEvent,
        eventResize: saveEvent
      }
    };

    function saveEvent(event) {
      event.$save();
    }

    function dayClicked(day) {
      var event = new calendarData.newEvent(day);
      calendarEventEditor.initialize($scope.calendar);
      calendarEventEditor.open(event, 'create');
    }

    function eventClicked(event) {
      calendarEventEditor.initialize($scope.calendar);
      calendarEventEditor.open(event, 'edit');
    }
  }
}());