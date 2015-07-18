/* global angular */
(function() {
  'use strict';

  angular.module('app.userAdministration').factory('users', Users);

  function Users($q, User) {
    var exports = {
      get: getUser,
      add: addUser
    };

    getAllUsers();

    return exports;

    function getAllUsers() {
      exports.all = User.query();
      return exports.all.$promise;
    }

    function getUser(id) {
      var dfd = $q.defer();
      var user = findUser(id);
      if (!!user) {
        dfd.resolve(user);
      }
      else {
        getAllUsers().then(function() {
          dfd.resolve(findUser(id));
        });
      }
      return dfd.promise;

      function findUser(id) {
        var matching = $.grep(exports.all, function(user) {
          return user._id === id;
        });
        return matching.length > 0 ? matching[0] : undefined;
      }
    }

    function addUser(user, success, error) {
      user.$save(savedSuccessfully, error);

      function savedSuccessfully(value, responseHeaders) {
        exports.all.push(user);
        if (!!success) {
          success(value, responseHeaders);
        }
      }
    }
  }
})();