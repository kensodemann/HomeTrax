angular.module('app')
  .controller('calendarCtrl', ['$scope', '$modal', 'calendarEvent', 'eventCategory',
    function($scope, $modal, calendarEvent, eventCategory) {
      $scope.dayClicked = function(day) {
        var event = new calendarEvent();
        event.start = new moment(day.hour(8));
        event.end = new moment(day.hour(9));
        event.allDay = false;
        openModal(event);
      };

      $scope.eventClicked = function(event) {
        openModal(event);
      };

      $scope.eventDropped = function(event) {
        console.log('You dopped the bomb on me');
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


      $scope.eventSources = [{
        events: calendarEvent.query()
      }];


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
  ]);