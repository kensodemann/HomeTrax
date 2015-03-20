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
      purchaseDate: new Date(2013, 9, 12),
      purchasePrice: 176000.00,
      mortgageBalance: 123432.00,
      propertyTaxes: 3234.00,
      insuranceCompany: 'Farmer\'s Insurance',
      policyNumber: '1234-45'
    };

    function InfoItem(label, columnName, dataType, modes) {
      this.label = label + ':';
      this.columnName = columnName;
      this.dataType = dataType;
      this.modes = (!!modes) ? modes : 'EV';
    }

    self.headerLines = [];
    self.headerLines.push(new InfoItem('Name', 'name'));
    self.headerLines.push(new InfoItem('Address Line 1', 'addressLine1'));
    self.headerLines.push(new InfoItem('Address Line 2', 'addressLine2'));
    //self.headerLines.push({
    //  value: self.household.city + ', ' + self.household.state + ' ' + self.household.postal,
    //  modes: 'V'
    //});
    self.headerLines.push(new InfoItem('City', 'city', 'string', 'E'));
    self.headerLines.push(new InfoItem('State', 'state', 'string', 'E'));
    self.headerLines.push(new InfoItem('Postal Code', 'postal', 'string', 'E'));
    self.headerLines.push(new InfoItem('Phone Number', 'phone'));


    var financialData = [];
    var insuranceData = [];
    financialData.push(new InfoItem('Purchase Date', 'purchaseDate', 'date'));
    financialData.push(new InfoItem('Purchase Price', 'purchasePrice', 'currency'));
    financialData.push(new InfoItem('Mortgage Balance', 'mortgageBalance', 'currency'));
    financialData.push(new InfoItem('Property Taxes', 'propertyTaxes', 'currency'));

    insuranceData.push(new InfoItem('Insurance Company', 'insuranceCompany'));
    insuranceData.push(new InfoItem('Policy Number', 'policyNumber'));

    self.basicInformation = [financialData, insuranceData];
  }
}());