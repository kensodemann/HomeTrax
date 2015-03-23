/* global angular */
(function() {
  'use strict';

  angular.module('app.household').controller('householdCtrl', HouseholdCtrl);

  function HouseholdCtrl(householdData) {
    var self = this;

    initialize();

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
    self.headerLines.push({
      template: '{{kwsModel.city}}, {{kwsModel.state}} {{kwsModel.postal}}',
      modes: 'V'
    });
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

    function initialize() {
      self.household = {};
      householdData.load().then(function(h) {
        self.household = householdData.household;
      });
    }
  }
}());