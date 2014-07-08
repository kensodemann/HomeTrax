angular.module('app')
  .controller('calendarCtrl', ['$scope',
    function($scope) {
      $scope.dayClicked = function() {
        console.log('A day has been clicked');
      };

      $scope.eventClicked = function() {
        console.log('An event has been clicked');
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
        events: [{
          title: 'Eat Something',
          allDay: false,
          start: '2014-06-20T12:00:00',
          end: '2014-06-20T13:00:00',
          category: 'Health & Fitness',
          private: false,
          user: 'KWS'
        }, {
          title: 'Get Brats and Drink',
          allDay: false,
          start: '2014-06-21T14:00:00',
          end: '2014-06-21T18:00:00',
          category: 'Recreation',
          private: true,
          user: 'KWS'
        }]
      }];
    }
  ]);