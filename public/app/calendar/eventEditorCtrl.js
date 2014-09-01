'use strict'

angular.module('app')
  .controller('eventEditorCtrl', ['$scope', '$modalInstance', 'eventModel', 'eventCategory',
    function($scope, $modalInstance, eventModel, eventCategory) {
      var eventCategories;
      var eventCategorySuggestions;

      initializeData();
      initializeDataWatchers();
      buildSuggestionEngine();

      $scope.cancel = function() {
        $modalInstance.dismiss();
      }

      $scope.ok = function() {
        copyScopeModelToDataModel();
        eventModel.$save(function(event, response) {
          $modalInstance.close(event);
        }, function(response) {
          $scope.errorMessage = response.data.reason;
        });
      }

      $scope.validate = function() {
        validateRequiredFields();
      }

      function initializeData() {
        eventCategories = eventCategory.query(function() {
          eventCategorySuggestions.initialize();
        });

        $scope.editorTitle = (eventModel._id) ? 'Edit Event' : 'New Event';
        $scope.errorMessage = '';
        $scope.dateTimeFormat = 'MM/DD/YYYY h:mm A';
        $scope.dateFormat = 'MM/DD/YYYY';

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
          eventModel.start = moment($scope.model.startDate, $scope.dateFormat);
          eventModel.end = moment($scope.model.endDate, $scope.dateFormat);
        } else {
          eventModel.start = moment($scope.model.startDateTime, $scope.dateTimeFormat);
          eventModel.end = moment($scope.model.endDateTime, $scope.dateTimeFormat);
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
        $scope.$watch('model.startDateTime', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            var n = moment(newValue, scope.dateTimeFormat);
            var o = moment(oldValue, scope.dateTimeFormat);
            var newEnd = moment(scope.model.endDateTime, scope.dateTimeFormat);
            newEnd.add(n - o);
            scope.model.endDateTime = newEnd.format(scope.dateTimeFormat);
            scope.model.startDate = n.format(scope.dateFormat);
          }
        });

        $scope.$watch('model.startDate', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            var n = moment(newValue, scope.dateFormat);
            var newStart = moment(scope.model.startDateTime, scope.dateTimeFormat);
            copyDate(n, newStart);
            scope.model.startDateTime = newStart.format(scope.dateTimeFormat);
          }
        });

        $scope.$watch('model.endDateTime', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            var n = moment(newValue, scope.dateTimeFormat);
            scope.model.endDate = n.format(scope.dateFormat);
          }
        });

        $scope.$watch('model.endDate', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            var n = moment(newValue, scope.dateFormat);
            var newEnd = moment(scope.model.endDateTime, scope.dateTimeFormat);
            copyDate(n, newEnd);
            scope.model.endDateTime = newEnd.format(scope.dateTimeFormat);
          }
        });

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

      function validateRequiredFields() {
        if (!$scope.model.title) {
          return $scope.errorMessage = 'Event Title is required';
        }

        if (!$scope.model.startDate) {
          return $scope.errorMessage = 'Start Date is required';
        }

        if (!$scope.model.endDate) {
          return $scope.errorMessage = 'End Date is required';
        }
      }
    }
  ]);