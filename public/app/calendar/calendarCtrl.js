angular.module('app')
  .controller('calendarCtrl', ['$scope', '$modal', 'calendarData',
    function($scope, $modal, calendarData) {
      function loadData() {
        calendarData.load().then(function() {
          $scope.eventSources[0].events = calendarData.events();
        });
      }

      loadData();

      // TODO: Test this
      $scope.dayClicked = function(day) {
        var event = new calendarData.newEvent(day);
        var m = openModal(event);
        m.result.then(function() {
          loadData();
        })
      };

      $scope.eventClicked = function(event) {
        var m = openModal(event);

        m.result.then(function(evt) {
          if (typeof evt === 'object') {
            replaceEvent(evt);
          } else {
            loadData();
          }
          $scope.calendar.fullCalendar('render');
        });

        function replaceEvent(evt) {
          var idx = firstMatchingIndex(evt);
          if (shouldRemoveFromCalendar($scope.eventSources[0].events[idx], evt)) {
            $scope.calendar.fullCalendar('removeEvents', evt._id);
          }
          loadData();
        }

        function firstMatchingIndex(evt) {
          var matchingEvts = $.grep($scope.eventSources[0].events, function(e) {
            return e._id === evt._id;
          });
          return $.inArray(matchingEvts[0], $scope.eventSources[0].events);
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
          if (onlyMine) {
            var excludedEvts = calendarData.excludedEvents();
            angular.forEach(excludedEvts, function(evt) {
              $scope.calendar.fullCalendar('removeEvents', evt._id);
            });
          }
          $scope.eventSources[0].events = calendarData.events();
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