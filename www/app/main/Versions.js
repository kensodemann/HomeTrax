(function() {
  'use strict';

  angular.module('app').factory('Versions', Versions);

  function Versions($resource, config) {
    var millisecondsPerMinute = 60000;

    return $resource(config.dataService + '/versions', {
      id: "@_id"
    }, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: transformArrayResponse
      }
    });

    function transformArrayResponse(data){
      var resp = angular.fromJson(data);
      resp.forEach(function(item) {
        if (item.releaseDate) {
          var d = new Date(item.releaseDate);
          item.releaseDate = adjustDateForTimezone(d);
        }
      });
      return resp;
    }

    function adjustDateForTimezone(d) {
      var minutesFromUTC = d.getTimezoneOffset();
      return new Date(d.getTime() + (minutesFromUTC * millisecondsPerMinute));
    }
  }
}());