/* global angular */
(function() {
  'use strict';

  angular.module('app.household').controller('householdCtrl', HouseholdCtrl);

  function HouseholdCtrl() {
    var self = this;

    var household = {
      name: 'My Condo',
      addressLine1: '2422 Fox River Pkwy',
      addressLine2: 'Unit F',
      city: 'Waukesha',
      state: 'WI',
      postal: '53189',
      phone: '(920) 988-4261',
      purchaseDate: '2012-10-12T00:00:00',
      purchasePrice: 176000.00,
      mortgageBalance: 123432.00,
      propertyTaxes: 3234.00,
      insuranceCompany: 'Farmers',
      policyNumber: '1234-45'
    };

    self.title = household.name;
    self.addressLines = [];
    self.addressLines.push(household.addressLine1);
    self.addressLines.push(household.addressLine2);
    self.addressLines.push(household.city + ', ' + household.state + ' ' + household.postal);
    self.addressLines.push(household.phone);
  }
}());