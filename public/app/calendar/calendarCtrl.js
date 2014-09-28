angular.module('app')
  .controller('calendarCtrl', ['$scope', '$modal', 'CalendarEvent', 'EventCategory',
    function($scope, $modal, CalendarEvent, EventCategory) {
      $scope.events = CalendarEvent.query(function(events) {
        $scope.eventSources[0].events = events.slice(0);
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

      $scope.eventDropped = function(event) {
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
          events: []//$scope.events.slice(0)
        }
      ];

      $scope.showOnlyMine = false;

      $scope.$watch('showOnlyMine', function(onlyMine) {
        // So, here is what I think needs to be done:
        //   On show:
        //      Create list of items that are not mine
        //      Push those items
        //   On hide:
        //      Create list of items that are not mine
        //      Remove those items
        var otherEvents = $.grep($scope.events, function(e) {
          return e.title !== 'New All Day Event' && e.title !== 'Sad Day';
        });

        if (onlyMine) {
          angular.forEach(otherEvents, function(evt) {
            $scope.calendar.fullCalendar('removeEvents', evt._id);
            //var idx = $.inArray(evt, $scope.eventSources[0].events);
            //$scope.eventSources[0].events.splice(idx, 1);
          });
          $scope.eventSources[0].events = $.grep($scope.events, function(e) {
            return e.title === 'New All Day Event' || e.title === 'Sad Day';
          });
        } else {
          $scope.eventSources[0].events = $scope.events.slice(0);
//         angular.forEach(otherEvents, function(evt){
//           $scope.eventSources[0].events.push(evt);
//         });
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