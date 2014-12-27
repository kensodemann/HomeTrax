/* global angular moment */
(function() {
  'use strict';

  angular.module('app.calendar').factory('eventEditor', eventEditor);

  function eventEditor($rootScope, $window, $modal, EventCategory, messageDialogService, users, identity) {
    var exports = {
      initialize: initialize,
      open: open
    };

    var editorScope = $rootScope.$new(true);
    editorScope.ctrl = {
      ok: saveAndClose,
      remove: remove,
      isReadonly: false,
      eventOwnerName: undefined,
      backgroundColor: setBackgroundColor
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
        eventResource.color = m.color;

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
      initializeEditorFlags();
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
          isPrivate: !!event.private,
          color: event.color || identity.currentUser.color
        };
      }

      function buildSuggestionEngine() {
        eventCategories = EventCategory.query(function() {
          eventCategorySuggestions.initialize();
        });

        var eventCategorySuggestions = new $window.Bloodhound({
          datumTokenizer: function(d) {
            return $window.Bloodhound.tokenizers.whitespace(d.name);
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

      function initializeEditorFlags() {
        editorScope.ctrl.mode = mode;
        editorScope.ctrl.title = (mode === 'create') ? 'New Event' : 'Edit Event';
        editorScope.ctrl.isReadonly = !!event.userId &&
          event.userId.toString() !== identity.currentUser._id.toString();
        if (editorScope.ctrl.isReadonly) {
          users.get(event.userId).then(function(user) {
            editorScope.ctrl.eventOwnerName = !!user ? user.firstName + ' ' + user.lastName : 'another user';
          });
        }
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
    
    function setBackgroundColor(color) {
      return {
        "background-color": color
      };
    }

    function initialize(cal) {
      owningCalendar = cal;
    }
  }
}());