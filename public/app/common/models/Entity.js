(function() {
  'use strict';

  angular.module('app.core').factory('Entity', Entity);

  function Entity($resource) {
    var millisecondsPerMinute = 60000;

    return $resource('/api/entities/:id', {
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
        if (item.purchaseDate) {
          var d = new Date(item.purchaseDate);
          item.purchaseDate = adjustDateForTimezone(d);
        }
      });
      return resp;
    }

    function transformResponse(data) {
      var resp = angular.fromJson(data);
      if (resp.purchaseDate) {
        var d = new Date(resp.purchaseDate);
        resp.purchaseDate = adjustDateForTimezone(d);
      }
      return resp;
    }

    function transformRequest(data) {
      if (data.purchaseDate) {
        data.purchaseDate = removeTimezoneOffset(data.purchaseDate);
      }
      return angular.toJson(data);
    }

    function adjustDateForTimezone(d) {
      var minutesFromUTC = d.getTimezoneOffset();
      return new Date(d.getTime() + (minutesFromUTC * millisecondsPerMinute));
    }

    function removeTimezoneOffset(d) {
      var minutesFromUTC = d.getTimezoneOffset();
      return new Date(d.getTime() - (minutesFromUTC * millisecondsPerMinute));
    }
  }
})();