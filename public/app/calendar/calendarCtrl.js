angular.module('app')
  .controller('calendarCtrl', ['$scope', '$modal', 'calendarData',
    function($scope, $modal, calendarData) {

      $scope.eventSources = [
        {
          events: function(start, end, timezone, callback) {
            calendarData.load().then(function() {
              callback(calendarData.events());
            });
          }
        }
      ];

      // TODO: Test this
      $scope.dayClicked = function(day) {
        var event = new calendarData.newEvent(day);
        var m = openModal(event);
        m.result.then(function() {
          $scope.calendar.fullCalendar('refetchEvents');
        })
      };

      $scope.eventClicked = function(event) {
        var m = openModal(event);

        m.result.then(function() {
          $scope.calendar.fullCalendar('refetchEvents');
        });
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

      $scope.showOnlyMine;

      $scope.$watch('showOnlyMine', function(onlyMine, previousValue) {
        if (onlyMine !== previousValue) {
          calendarData.limitToMine(onlyMine);
          $scope.calendar.fullCalendar('refetchEvents');
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