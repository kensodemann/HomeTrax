'use strict'

angular.module('app')
  .controller('eventEditorCtrl', ['$scope', '$modalInstance', 'eventModel',
    function($scope, $modalInstance, eventModel) {
      initializeData();
      inintializeDates();
      initializeDataWatchers();

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
        $scope.editorTitle = (eventModel._id) ? 'Edit Event' : 'New Event';
        $scope.errorMessage = '';
        $scope.dateTimeFormat = 'MM/DD/YYYY h:mm A';
        $scope.dateFormat = 'MM/DD/YYYY';

        copyDataModelToScopeModel();
        getCategories();
      }

      function getCategories() {
        // instantiate the bloodhound suggestion engine
        var cats = new Bloodhound({
          datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.name);
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: [{
            name: 'Test'
          }, {
            name: 'Health & Fitness'
          }, {
            name: 'Sexual Relations'
          }, {
            name: 'Recreation'
          }, {
            name: 'Work'
          }]
        });
        cats.initialize();

        $scope.categories = {
          displayKey: 'name',
          source: cats.ttAdapter()
        };

        $scope.categoryOptions = {
          highlight: true,
          hint: true
        };
      }

      function copyDataModelToScopeModel() {
        $scope.model = {
          title: eventModel.title,
          category: eventModel.category,
          isAllDayEvent: eventModel.allDay,
          isPrivate: eventModel.private,
          user: eventModel.user
        };

        $scope.model.startDate = stringifyDate((eventModel.start) ? eventModel.start : moment(moment().format('YYYY-MM-DD')).hour(8));
        $scope.model.endDate = stringifyDate((eventModel.end) ? eventModel.end : moment(moment().format('YYYY-MM-DD')).hour(9));
      }

      function copyScopeModelToDataModel() {
        eventModel.title = $scope.model.title;
        eventModel.category = (typeof $scope.model.category === 'object') ? $scope.model.category.name : $scope.model.category;
        eventModel.allDay = $scope.model.isAllDayEvent;
        eventModel.start = moment($scope.model.startDate, $scope.dateTimeFormat);
        eventModel.end = moment($scope.model.endDate, $scope.dateTimeFormat);
        eventModel.private = $scope.model.isPrivate;
        eventModel.user = $scope.model.user;
      }

      function inintializeDates() {
        eventModel.start = stringifyDate((eventModel.start) ? eventModel.start : moment(moment().format('YYYY-MM-DD')).hour(8));
        eventModel.end = stringifyDate((eventModel.end) ? eventModel.end : moment(moment().format('YYYY-MM-DD')).hour(9));
      }

      function stringifyDate(d) {
        if (typeof d === 'string') {
          return d;
        }
        return d.format(($scope.model.isAllDayEvent ? $scope.dateFormat : $scope.dateTimeFormat));
      }

      function datifyString(s) {
        if (typeof s !== 'string') {
          return s;
        }

        return moment(s, ($scope.model.isAllDayEvent ? $scope.dateFormat : $scope.dateTimeFormat));
      }

      function initializeDataWatchers() {
        $scope.$watch('model.startDate', function(newValue, oldValue, scope) {
          if (newValue !== oldValue) {
            var n = datifyString(newValue);
            var o = datifyString(oldValue);
            var newEnd = datifyString(scope.model.endDate);
            newEnd.add(n - o);
            scope.model.endDate = stringifyDate(newEnd);
          }
        });

        $scope.$watch('model.isAllDayEvent', function(newValue, oldValue, scope) {
          if (newValue && !oldValue) {
            scope.model.startDate = convertFormat(scope.model.startDate);
            scope.model.endDate = convertFormat(scope.model.endDate);
          } else if (!newValue && oldValue) {
            scope.model.startDate = setHour(scope.model.startDate, 8);
            scope.model.endDate = setHour(scope.model.endDate, 1);
          }
        });

        function convertFormat(d) {
          var newD = datifyString(d);
          return stringifyDate(newD);
        }

        function setHour(d, h) {
          var newD = datifyString(d);
          newD.hour(h);
          return stringifyDate(newD);
        }
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