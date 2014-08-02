angular.module('app')
  .controller('calendarCtrl', ['$scope', '$modal', 'calendarEvent',
    function($scope, $modal, calendarEvent) {
      $scope.dayClicked = function(day) {
        console.log(day);
        var event = new calendarEvent();
        event.start = day;
        event.end = day;
        event.allDay = false;
        openModal(event);
      };

      $scope.eventClicked = function(event) {
        console.log('An event has been clicked');
        openModal(event);
      };

      $scope.eventDropped = function(event) {
        console.log('You dopped the bomb on me');
      };

      $scope.uiConfig = {
        calendar: {
          editable: true,
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