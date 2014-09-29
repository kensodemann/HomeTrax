angular.module('app')
  .controller('calendarCtrl', ['$scope', '$modal', 'calendarData',
    function($scope, $modal, calendarData) {
      calendarData.load().then(function() {
        $scope.events = calendarData.events();
        $scope.eventSources[0].events = $scope.events;
      });

      $scope.dayClicked = function(day) {
        var event = new CalendarEvent();
        event.start = moment(day.hour(8));
        event.end = moment(day.hour(9));
        event.allDay = false;
        var m = openModal(event);
        m.result.then(function(e) {
          $scope.events.push(e);
        })
      };

      $scope.eventClicked = function(event) {
        var m = openModal(event);

        m.result.then(function(evt) {
          if (typeof evt === 'object') {
            replaceEvent(evt);
          } else {
            removeEvent(event);
          }
          $scope.calendar.fullCalendar('render');
        });

        function replaceEvent(evt) {
          var idx = firstMatchingIndex(evt);
          if (shouldRemoveFromCalendar($scope.events[idx], evt)) {
            $scope.calendar.fullCalendar('removeEvents', evt._id);
          }
          $scope.events.splice(idx, 1);
          $scope.events.push(evt);
        }

        function removeEvent(evt) {
          var idx = firstMatchingIndex(evt);
          $scope.events.splice(idx, 1);
          $scope.calendar.fullCalendar('removeEvents', evt._id);
        }

        function firstMatchingIndex(evt) {
          var matchingEvts = $.grep($scope.events, function(e) {
            return e._id === evt._id;
          });
          return $.inArray(matchingEvts[0], $scope.events);
        }

        function shouldRemoveFromCalendar(originalEvent, editedEvent) {
          return (originalEvent.allDay && !editedEvent.allDay) ||
            (!originalEvent.allDay && editedEvent.allDay) ||
            (originalEvent.title !== editedEvent.title);
        }
      };

      $scope.eventDropped = function() {
        console.log('You dropped the bomb on me');
      };

      $scope.uiConfig = {
        calendar: {
          editable: true,
          timezone: 'local',
          header: {
            left: 'month agendaWeek agendaDay',
            center: 'title',
            right: 'today prev,next'
          },
          dayClick: $scope.dayClicked,
          eventClick: $scope.eventClicked,
          eventDrop: $scope.eventDropped
        }
      };

      $scope.eventSources = [
        {
          events: []
        }
      ];

      $scope.showOnlyMine;

      $scope.$watch('showOnlyMine', function(onlyMine, previousValue) {
        if (onlyMine !== previousValue) {
          calendarData.limitToMine(onlyMine);
          if (onlyMine){
            var excludedEvts = calendarData.excludedEvents();
            angular.forEach(excludedEvts, function(evt) {
              $scope.calendar.fullCalendar('removeEvents', evt._id);
            });
          }
          $scope.events = calendarData.events();
          $scope.eventSources[0].events = $scope.events;
        }
      });


      function openModal(model) {
        return $modal.open({
          templateUrl: '/partials/calendar/eventEditor',
          controller: 'eventEditorCtrl',
          backdrop: 'static',
          resolve: {
            eventModel: function() {
              return model;
            }
          }
        });
      }
    }
  ])
;