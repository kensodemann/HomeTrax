/* global angular */
(function() {
  'use strict';

  angular.module('app.household').controller('householdCtrl', HouseholdCtrl);

  function HouseholdCtrl() {
    var self = this;

    self.household = {
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

    self.title = self.household.name;
    self.addressLines = [];
    self.addressLines.push(self.household.addressLine1);
    self.addressLines.push(self.household.addressLine2);
    self.addressLines.push(self.household.city + ', ' + self.household.state + ' ' + self.household.postal);
    self.addressLines.push(self.household.phone);

    function InfoItem(label, value){
      this.label = label + ':';
      this.columnName = value;
    }

    var financialData = [];
    var insuranceData = [];
    financialData.push(new InfoItem('Purchase Date', 'purchaseDate'));
    financialData.push(new InfoItem('Purchase Price', 'purchasePrice'));
    financialData.push(new InfoItem('Mortgage Balance', 'mortgageBalance'));
    financialData.push(new InfoItem('Property Taxes', 'propertyTaxes'));

    insuranceData.push(new InfoItem('Insurance Company', 'insuranceCompany'));
    insuranceData.push(new InfoItem('Policy Number', 'policyNumber'));

    self.basicInformation = [financialData, insuranceData];
  }
}());