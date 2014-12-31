/* global angular moment */
(function() {
  'use strict';

  angular.module('app.calendar').factory('eventEditor', eventEditor);

  function eventEditor($rootScope, $window, $modal, EventCategory, messageDialogService, users, identity, colors) {
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
      backgroundColor: setBackgroundColor,
      colorPanelClass: colorPanelClass,
      selectColor: selectColor
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
    var currentCalendar;

    return exports;

    function initialize(cal) {
      currentCalendar = cal;
    }

    function open(event, mode) {
      eventResource = event;
      initializeEditor();
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
          color: (colors.eventColors.indexOf(event.color) > -1) ? event.color : identity.currentUser.color
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

      function initializeEditor() {
        var ctrl = editorScope.ctrl;

        ctrl.mode = mode;
        ctrl.title = (mode === 'create') ? 'New Event' : 'Edit Event';
        ctrl.isReadonly = !!event.userId &&
          event.userId.toString() !== identity.currentUser._id.toString();
        if (ctrl.isReadonly) {
          users.get(event.userId).then(function(user) {
            ctrl.eventOwnerName = !!user ? user.firstName + ' ' + user.lastName : 'another user';
          });
        }
        ctrl.colors = [identity.currentUser.color];
        angular.forEach(colors.eventColors, function(c) {
          ctrl.colors.push(c);
        });
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
      if (currentCalendar) {
        currentCalendar.fullCalendar('refetchEvents');
      }
      editor.hide();
    }

    function displayError(response) {
      editorScope.ctrl.errorMessage = response.data.reason;
    }


    function setBackgroundColor(color) {
      return {
        "background-color": color
      };
    }

    function colorPanelClass(color) {
      return color === editorScope.ctrl.model.color ? "form-control-selected" : "";
    }

    function selectColor(color) {
      editorScope.ctrl.model.color = color;
    }
  }
}());