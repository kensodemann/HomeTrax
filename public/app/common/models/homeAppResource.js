(function() {
  'use strict';

  var _dateUtilities;
  var _resource;

  angular.module('app.core')
    .run(function($resource, dateUtilities) {
      _resource = $resource;
      _dateUtilities = dateUtilities;
    })
    .constant('HomeAppResource', HomeAppResource);

  function HomeAppResource(resourceName) {
    var dateColumns = ['purchaseDate'];

    return _resource('/api/' + resourceName + '/:id', {
      id: "@_id"
    }, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: transformArrayResponse
      },
      save: {
        method: 'POST',
        transformResponse: transformResponse,
        transformRequest: transformRequest
      }
    });


    function transformArrayResponse(data) {
      var resp = angular.fromJson(data);
      resp.forEach(function(item) {
        addTimezoneOffset(item);
      });
      return resp;
    }

    function transformResponse(data) {
      var resp = angular.fromJson(data);
      addTimezoneOffset(resp);
      return resp;
    }

    function transformRequest(data) {
      removeTimezoneOffset(data);
      return angular.toJson(data);
    }

    function addTimezoneOffset(item) {
      dateColumns.forEach(function(col) {
        if (item[col]) {
          var d = new Date(item[col]);
          item[col] = _dateUtilities.addTimezoneOffset(d);
        }
      });
    }

    function removeTimezoneOffset(item) {
      dateColumns.forEach(function(col) {
        if (item[col]) {
          item[col] = _dateUtilities.removeTimezoneOffset(item[col]);
        }
      });
    }
  }
}());