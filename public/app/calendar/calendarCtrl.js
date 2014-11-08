angular.module('app')
  .controller('calendarCtrl', ['$scope', '$log', '$modal', 'calendarData', 'EventCategory', 'messageDialogService',
    function($scope, $log, $modal, calendarData, EventCategory, messageDialogService) {
      var dateTimeFormat = 'MM/DD/YYYY h:mm A';
      var dateFormat = 'MM/DD/YYYY';

      $scope.eventSources = [{
        events: function(start, end, timezone, callback) {
          calendarData.load().then(function() {
            $scope.eventCategories = calendarData.eventCategories();
            callback(calendarData.events());
          });
        }
      }];

      var editorScope = $scope.$new(true);
      editorScope.dateTimeFormat = dateTimeFormat;
      editorScope.dateFormat = dateFormat;
      var eventEditor = $modal({
        template: '/partials/calendar/templates/eventEditor',
        backdrop: 'static',
        show: false,
        scope: editorScope
      });

      editorScope.ok = function() {
        copyEditorModelToEventResource();
        editorScope.resource.$save(function() {
          $scope.calendar.fullCalendar('refetchEvents');
          eventEditor.hide();
        }, function(response) {
          editorScope.errorMessage = response.data.reason;
        });
      };

      editorScope.remove = function() {
        return messageDialogService.ask('Are you sure you would like to remove this event?', 'Remove Event')
          .then(function(answer) {
            function success(){
              $scope.calendar.fullCalendar('refetchEvents');
              eventEditor.hide();
            }

            if (answer) {
              editorScope.resource.$remove(success);
            }
          });
      };

      $scope.dayClicked = function(day) {
        editorScope.title = 'New Event';
        editorScope.displayRemoveButton = false;
        editorScope.resource = new calendarData.newEvent(day);
        buildSuggestionEngine();
        showEditor();
      };

      $scope.eventClicked = function(event) {
        editorScope.title = 'Edit Event';
        editorScope.displayRemoveButton = true;
        editorScope.resource = event;
        buildSuggestionEngine();
        showEditor();
      };

      function showEditor() {
        copyEventToEditorModel(editorScope.resource);
        initializeDataWatchers();
        eventEditor.$promise.then(function() {
          eventEditor.show();
        });
      }

      function copyEventToEditorModel(event) {
        editorScope.model = {
          title: event.title,
          isAllDayEvent: !!event.allDay,
          start: event.start.valueOf(),
          end: event.end.valueOf(),
          category: event.category,
          isPrivate: !!event.private,
          user: event.user
        }
      }

      function copyEditorModelToEventResource() {
        var m = editorScope.model;
        var res = editorScope.resource;
        res.title = m.title;
        res.allDay = m.isAllDayEvent;
        res.start = moment(m.start);
        res.end = moment(m.end);
        res.category = (typeof m.category === 'object') ? m.category.name : lookupCategory(m.category);
        res.private = m.isPrivate;
        res.user = m.user;
      }

      function lookupCategory(category) {
        if (category) {
          var matching = $.grep(editorScope.eventCategories, function(c) {
            return c.name.toUpperCase() === category.toUpperCase();
          });

          if (matching.length > 0) {
            return matching[0].name;
          } else {
            EventCategory.save({
              name: category
            });
          }
        }

        return category;
      }

      var dateWatcher;

      function initializeDataWatchers() {
        deregisterPreviousWatcher();
        dateWatcher = editorScope.$watch('model.start', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            adjustEndDateTime(newValue, oldValue, scope);
          }
        });

        function deregisterPreviousWatcher() {
          if (dateWatcher) {
            dateWatcher();
          }
        }

        function adjustEndDateTime(newDate, oldDate, scope) {
          scope.model.end += (newDate - oldDate);
        }
      }

      // TODO: test?
      // TODO: Look into using the AngularStrap typeahead instead
      function buildSuggestionEngine() {
        editorScope.eventCategories = EventCategory.query(function() {
          eventCategorySuggestions.initialize();
        });

        var eventCategorySuggestions = new Bloodhound({
          datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.name);
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: editorScope.eventCategories
        });

        editorScope.categories = {
          displayKey: 'name',
          source: eventCategorySuggestions.ttAdapter()
        };

        editorScope.categoryOptions = {
          highlight: true,
          hint: true
        };
      }

      $scope.categoryChanged = function(cat) {
        if (cat.include) {
          calendarData.includeCategory(cat.name);
        } else {
          calendarData.excludeCategory(cat.name);
        }
        $scope.calendar.fullCalendar('refetchEvents');
      };

      $scope.eventDropped = function() {
        $log.log('You dropped the bomb on me');
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
    }

  ])
;