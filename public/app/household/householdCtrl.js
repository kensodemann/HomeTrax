/* global angular */
(function() {
  'use strict';

  angular.module('app.household').controller('householdCtrl', HouseholdCtrl);

  function HouseholdCtrl(householdData) {
    var self = this;

    initialize();

    function InfoItem(label, columnName, template, modes) {
      this.label = label + ':';
      this.columnName = columnName;
      this.template = template;
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
    self.headerLines.push(new InfoItem('City', 'city', undefined, 'E'));
    self.headerLines.push(new InfoItem('State', 'state', undefined, 'E'));
    self.headerLines.push(new InfoItem('Postal Code', 'postal', undefined, 'E'));
    self.headerLines.push(new InfoItem('Phone Number', 'phone'));


    var financialData = [];
    var insuranceData = [];
    financialData.push(new InfoItem('Purchase Date', 'purchaseDate', "{{kwsModel.purchaseDate | date: 'mediumDate' }}"));
    financialData.push(new InfoItem('Purchase Price', 'purchasePrice', '{{kwsModel.purchasePrice | currency }}'));
    financialData.push(new InfoItem('Mortgage Balance', 'mortgageBalance', '{{kwsModel.mortgageBalance | currency }}'));
    financialData.push(new InfoItem('Property Taxes', 'propertyTaxes', '{{kwsModel.propertyTaxes | currency }}'));

    insuranceData.push(new InfoItem('Insurance Company', 'insuranceCompany'));
    insuranceData.push(new InfoItem('Policy Number', 'policyNumber'));

    self.basicInformation = [financialData, insuranceData];

    function initialize() {
      householdData.load().then(function() {
        self.household = householdData.household;
        self.household.purchaseDate = new Date(2013, 9, 15);
        self.household.purchasePrice = 176004.23;
        self.household.mortgageBalance = 123043.72;
        self.household.propertyTaxes = 3402.50;

        self.household.insuranceCompany = "Farmer's Insurance";
        self.household.policyNumber = '12349-39500-3';
      });
    }
  }
}());