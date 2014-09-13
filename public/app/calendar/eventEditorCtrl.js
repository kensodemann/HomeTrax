'use strict';

angular.module('app')
  .controller('eventEditorCtrl', ['$scope', '$modal', '$modalInstance', 'eventModel', 'eventCategory',
    function($scope, $modal, $modalInstance, eventModel, eventCategory) {
      var eventCategories;
      var eventCategorySuggestions;

      initializeData();
      initializeDataWatchers();
      buildSuggestionEngine();

      $scope.cancel = function() {
        $modalInstance.dismiss();
      };

      $scope.ok = function() {
        copyScopeModelToDataModel();
        eventModel.$save(function(event) {
          $modalInstance.close(event);
        }, function(response) {
          $scope.errorMessage = response.data.reason;
        });
      };

      $scope.remove = function() {
        var m = $modal.open({
          templateUrl: '/partials/common/messageDialog',
          controller: 'messageDialogCtrl',
          backdrop: 'static',
          resolve: {
            messageModel: function() {
              return {
                title: 'Delete Event?',
                message: 'Are you sure you want to remove this event?'
              };
            }
          }
        });
        m.result.then(function() {
          eventModel.$remove().then(function() {
            $modalInstance.close(true);
          }, function(reason) {
            $scope.errorMessage = reason;
          });
        });
      };

      function initializeData() {
        eventCategories = eventCategory.query(function() {
          eventCategorySuggestions.initialize();
        });

        $scope.editorTitle = (eventModel._id) ? 'Edit Event' : 'New Event';
        $scope.errorMessage = '';
        $scope.dateTimeFormat = 'MM/DD/YYYY h:mm A';
        $scope.dateFormat = 'MM/DD/YYYY';
        $scope.displayRemoveButton = (eventModel._id) ? true : false;

        copyDataModelToScopeModel();
      }

      function copyDataModelToScopeModel() {
        var today = moment();
        $scope.model = {
          title: eventModel.title,
          category: eventModel.category,
          isAllDayEvent: eventModel.allDay,
          isPrivate: eventModel.private,
          user: eventModel.user,
          startDate: (eventModel.start ? eventModel.start : today).format($scope.dateFormat),
          endDate: (eventModel.end ? eventModel.end : today).format($scope.dateFormat),
          startDateTime: (eventModel.start ? eventModel.start : today).format($scope.dateTimeFormat),
          endDateTime: (eventModel.end ? eventModel.end : today).format($scope.dateTimeFormat)
        };
      }

      function copyScopeModelToDataModel() {
        eventModel.title = $scope.model.title;
        eventModel.category = (typeof $scope.model.category === 'object') ? $scope.model.category.name : lookupCategory($scope.model.category);
        eventModel.allDay = $scope.model.isAllDayEvent;
        if ($scope.model.isAllDayEvent) {
          eventModel.start = $.fullCalendar.moment($scope.model.startDate, $scope.dateFormat);
          eventModel.end = $.fullCalendar.moment($scope.model.endDate, $scope.dateFormat);
        } else {
          eventModel.start = $.fullCalendar.moment($scope.model.startDateTime, $scope.dateTimeFormat);
          eventModel.end = $.fullCalendar.moment($scope.model.endDateTime, $scope.dateTimeFormat);
        }
        eventModel.private = $scope.model.isPrivate;
        eventModel.user = $scope.model.user;
      }

      function lookupCategory(category) {
        if (category) {
          var matching = $.grep(eventCategories, function(c) {
            return c.name.toUpperCase() === category.toUpperCase();
          });

          if (matching.length > 0) {
            return matching[0].name;
          } else {
            eventCategory.save({
              name: category
            });
          }
        }

        return category;
      }

      function initializeDataWatchers() {
        $scope.$watch('model.title', function(newValue, oldValue) {
          if (newValue != oldValue) {
            validate();
          }
        });

        $scope.$watch('model.category', function(newValue, oldValue) {
          if (newValue != oldValue) {
            validate();
          }
        });

        $scope.$watch('model.startDateTime', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            validate();
            var n = moment(newValue, scope.dateTimeFormat);
            var o = moment(oldValue, scope.dateTimeFormat);
            adjustEndDateTime(n, o, scope);
            scope.model.startDate = n.format(scope.dateFormat);
          }
        });

        $scope.$watch('model.startDate', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            validate();
            scope.model.startDateTime = adjustDateTimeDate(scope.model.startDateTime, newValue, scope);
          }
        });

        $scope.$watch('model.endDateTime', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            validate();
            var n = moment(newValue, scope.dateTimeFormat);
            scope.model.endDate = n.format(scope.dateFormat);
          }
        });

        $scope.$watch('model.endDate', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            validate();
            scope.model.endDateTime = adjustDateTimeDate(scope.model.endDateTime, newValue, scope);
          }
        });

        function adjustEndDateTime(newMoment, oldMoment, scope) {
          var newEnd = moment(scope.model.endDateTime, scope.dateTimeFormat);
          newEnd.add(newMoment - oldMoment);
          scope.model.endDateTime = newEnd.format(scope.dateTimeFormat);
        }

        function adjustDateTimeDate(dateTime, newValue, scope) {
          var n = moment(newValue, scope.dateFormat);
          var newDateTime = moment(dateTime, scope.dateTimeFormat);
          copyDate(n, newDateTime);
          return newDateTime.format(scope.dateTimeFormat);
        }

        function copyDate(fromDate, toDate) {
          toDate.month(fromDate.month());
          toDate.date(fromDate.date());
          toDate.year(fromDate.year());
        }
      }

      function buildSuggestionEngine() {
        eventCategorySuggestions = new Bloodhound({
          datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.name);
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: eventCategories
        });

        $scope.categories = {
          displayKey: 'name',
          source: eventCategorySuggestions.ttAdapter()
        };

        $scope.categoryOptions = {
          highlight: true,
          hint: true
        };
      }

      function validate() {
        $scope.errorMessage = null;
        validateDates();
      }

      function validateDates() {
        var start = moment($scope.model.startDateTime, $scope.dateTimeFormat);
        var end = moment($scope.model.endDateTime, $scope.dateTimeFormat);

        if (end.isBefore(start)) {
          return $scope.errorMessage = 'The end date must be on or after the start date';
        }
      }
    }
  ]);