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
      purchaseDate: '10/12/2013',
      purchasePrice: '176,000.00',
      mortgageBalance: '123,432.00',
      propertyTaxes: '3,234.00',
      insuranceCompany: 'Farmer\'s Insurance',
      policyNumber: '1234-45'
    };

    self.title = household.name;
    self.addressLines = [];
    self.addressLines.push(household.addressLine1);
    self.addressLines.push(household.addressLine2);
    self.addressLines.push(household.city + ', ' + household.state + ' ' + household.postal);
    self.addressLines.push(household.phone);

    function InfoItem(label, value){
      this.label = label + ':';
      this.value = value;
    }

    var financialData = [];
    var insuranceData = [];
    financialData.push(new InfoItem('Purchase Date', household.purchaseDate));
    financialData.push(new InfoItem('Purchase Price', household.purchasePrice));
    financialData.push(new InfoItem('Mortgage Balance', household.mortgageBalance));
    financialData.push(new InfoItem('Property Taxes', household.propertyTaxes));

    insuranceData.push(new InfoItem('Insurance Company', household.insuranceCompany));
    insuranceData.push(new InfoItem('Policy Number', household.policyNumber));

    self.basicInformation = [financialData, insuranceData];
  }
}());