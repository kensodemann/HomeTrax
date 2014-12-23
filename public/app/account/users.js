/* global angular */
(function() {
  'use strict';
  
  angular.module('app.account').factory('users', Users);

  function Users(User) {
    var exports = {};
    
    getAllUsers();
    
    return exports;
    
    function getAllUsers(){
      User.query();
    }
  }
})();