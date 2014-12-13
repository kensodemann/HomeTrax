(function() {
  'use strict';

  angular.module('app').factory('eventEditor', eventEditor);

  function eventEditor($rootScope, $window, $modal, EventCategory, messageDialogService) {
    var exports = {
      initialize: initialize,
      open: open
    };

    var editorScope = $rootScope.$new(true);
    editorScope.ctrl = {
      ok: saveAndClose,
      remove: remove
    };
    var editor = $modal({
      template: '/partials/calendar/templates/eventEditor',
      backdrop: 'static',
      scope: editorScope,
      show: false
    });

    var dateWatcher;
    var eventCategories;
    var eventResource;
    var owningCalendar;

    return exports;

    function saveAndClose() {
      copyEditorModelToEventResource();
      eventResource.$save(close, displayError);

      function copyEditorModelToEventResource() {
        var m = editorScope.ctrl.model;
        eventResource.title = m.title;
        eventResource.allDay = m.isAllDayEvent;
        eventResource.start = moment(m.start);
        eventResource.end = moment(m.end);
        eventResource.category = (typeof m.category === 'object') ? m.category.name : lookupCategory(m.category);
        eventResource.private = m.isPrivate;
        eventResource.user = m.user;

        function lookupCategory(category) {
          if (category) {
            var matching = $.grep(eventCategories, function(c) {
              return c.name.toUpperCase() === category.toUpperCase();
            });

            if (matching.length === 0) {
              EventCategory.save({
                name: category
              });
              return category;
            }
            return matching[0].name;
          }
        }
      }
    }

    function remove() {
      return messageDialogService.ask('Are you sure you would like to remove this event?', 'Remove Event')
        .then(handleAnswer);

      function handleAnswer(answer) {
        if (answer) {
          eventResource.$remove(close, displayError);
        }
      }
    }

    function close() {
      if (owningCalendar) {
        owningCalendar.fullCalendar('refetchEvents');
      }
      editor.hide();
    }

    function displayError(response) {
      editorScope.ctrl.errorMessage = response.data.reason;
    }

    function open(event, mode) {
      eventResource = event;
      editorScope.ctrl.mode = mode;
      editorScope.ctrl.title = (mode === 'create') ? 'New Event' : 'Edit Event';
      copyEventToEditorModel();
      buildSuggestionEngine();
      initializeDataWatchers();
      editor.$promise.then(editor.show);

      function copyEventToEditorModel() {
        editorScope.ctrl.model = {
          title: event.title,
          isAllDayEvent: !!event.allDay,
          start: event.start.valueOf(),
          end: event.end.valueOf(),
          category: event.category,
          isPrivate: !!event.private
        };
      }

      function buildSuggestionEngine() {
        eventCategories = EventCategory.query(function() {
          eventCategorySuggestions.initialize();
        });

        var eventCategorySuggestions = new $window.Bloodhound({
          datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.name);
          },
          queryTokenizer: $window.Bloodhound.tokenizers.whitespace,
          local: eventCategories
        });

        editorScope.ctrl.categories = {
          displayKey: 'name',
          source: eventCategorySuggestions.ttAdapter()
        };

        editorScope.ctrl.categoryOptions = {
          highlight: true,
          hint: true
        };
      }

      function initializeDataWatchers() {
        deregisterPreviousWatcher();
        dateWatcher = editorScope.$watch('ctrl.model.start', adjustEndDateTime);

        function deregisterPreviousWatcher() {
          if (dateWatcher) {
            dateWatcher();
          }
        }

        function adjustEndDateTime(newDate, oldDate, scope) {
          if (newDate !== oldDate) {
            scope.ctrl.model.end += (newDate - oldDate);
          }
        }
      }
    }

    function initialize(cal) {
      owningCalendar = cal;
    }
  }
}());