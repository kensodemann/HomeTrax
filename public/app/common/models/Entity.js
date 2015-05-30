(function() {
  'use strict';

  angular.module('app.core').factory('Entity', Entity);

  function Entity($resource, dateUtilities) {
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
          item.purchaseDate = dateUtilities.addTimezoneOffset(d);
        }
      });
      return resp;
    }

    function transformResponse(data) {
      var resp = angular.fromJson(data);
      if (resp.purchaseDate) {
        var d = new Date(resp.purchaseDate);
        resp.purchaseDate = dateUtilities.addTimezoneOffset(d);
      }
      return resp;
    }

    function transformRequest(data) {
      if (data.purchaseDate) {
        data.purchaseDate = dateUtilities.removeTimezoneOffset(data.purchaseDate);
      }
      return angular.toJson(data);
    }
  }
})();