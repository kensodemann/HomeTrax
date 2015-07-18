/* global angular */
(function() {
  'use strict';

  angular.module('app.household').controller('householdMenuCtrl', HouseholdMenuCtrl);

  function HouseholdMenuCtrl(identity) {
    this.identity = identity;
  }
}());