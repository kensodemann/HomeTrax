angular.module('app')
  .controller('calendarCtrl', ['$scope', '$modal', 'calendarEvent', 'eventCategory',
    function ($scope, $modal, calendarEvent, eventCategory){
      $scope.dayClicked = function (day){
        var event = new calendarEvent();
        event.start = new moment(day.hour(8));
        event.end = new moment(day.hour(9));
        event.allDay = false;
        var m = openModal(event);
        m.result.then(function (e){
          $scope.events.push(e);
        })
      };

      $scope.eventClicked = function (event){
        var m = openModal(event);

        m.result.then(function (evt){
          if (typeof evt === 'object') {
            replaceEvent(evt);
          }else{
            removeEvent(event);
          }
          $scope.calendar.fullCalendar('render');
        });

        function replaceEvent(evt){
          var idx = firstMatchingIndex(evt);
          if (shouldRemoveFromCalendar($scope.events[idx], evt)) {
            $scope.calendar.fullCalendar('removeEvents', evt._id);
          }
          $scope.events.splice(idx, 1);
          $scope.events.push(evt);
        }

        function removeEvent(evt){
          var idx = firstMatchingIndex(evt);
          $scope.events.splice(idx, 1);
          $scope.calendar.fullCalendar('removeEvents', evt._id);
        }

        function firstMatchingIndex(evt){
          var matchingEvts = $.grep($scope.events, function (e){
            return e._id === evt._id;
          });
          return $.inArray(matchingEvts[0], $scope.events);
        }

        function shouldRemoveFromCalendar(originalEvent, editedEvent){
          return (originalEvent.allDay && !editedEvent.allDay) ||
            (!originalEvent.allDay && editedEvent.allDay) ||
            (originalEvent.title !== editedEvent.title);
        }
      };

      $scope.eventDropped = function (event){
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

      $scope.events = calendarEvent.query();

      $scope.eventSources = [
        {
          events: $scope.events
        }
      ];


      function openModal(model){
        return $modal.open({
          templateUrl: '/partials/calendar/eventEditor',
          controller: 'eventEditorCtrl',
          backdrop: 'static',
          resolve: {
            eventModel: function (){
              return model;
            }
          }
        });
      }
    }
  ]);