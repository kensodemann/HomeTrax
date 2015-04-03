/* global angular */
(function() {
  'use strict';

  angular.module('app.household').controller('householdCtrl', HouseholdCtrl);

  function HouseholdCtrl(householdData) {
    var self = this;

    initialize();

    function initialize() {
      householdData.load().then(function() {
        self.household = householdData.household;
      });
      setupHeaderLines();
      setupInformationLines();
    }

    function setupHeaderLines() {
      self.headerLines = [];
      self.headerLines.push(new InfoItem('Name', 'name'));
      self.headerLines.push(new InfoItem('Address Line 1', 'addressLine1'));
      self.headerLines.push(new InfoItem('Address Line 2', 'addressLine2'));
      self.headerLines.push(new InfoItem(undefined, undefined, 'V',
        '{{kwsModel.city}}, {{kwsModel.state}} {{kwsModel.postal}}'));
      self.headerLines.push(new InfoItem('City', 'city', 'E'));
      self.headerLines.push(new InfoItem('State', 'state', 'E'));
      self.headerLines.push(new InfoItem('Postal Code', 'postal', 'E'));
      self.headerLines.push(new InfoItem('Phone Number', 'phone'));
    }

    function setupInformationLines() {
      var financialData = [];
      var insuranceData = [];
      financialData.push(new InfoItem('Purchase Date', 'purchaseDate', 'EV',
        "{{kwsModel.purchaseDate | date: 'mediumDate' }}",
        '<input type="text" class="form-control" name="purchaseDate" bs-datepicker data-autoclose="true" ng-model="kwsModel[\'purchaseDate\']">'));
      financialData.push(new InfoItem('Purchase Price', 'purchasePrice', 'EV', '{{kwsModel.purchasePrice | currency }}'));
      financialData.push(new InfoItem('Mortgage Balance', 'mortgageBalance', 'EV', '{{kwsModel.mortgageBalance | currency }}'));
      financialData.push(new InfoItem('Property Taxes', 'propertyTaxes', 'EV', '{{kwsModel.propertyTaxes | currency }}'));

      insuranceData.push(new InfoItem('Insurance Company', 'insuranceCompany'));
      insuranceData.push(new InfoItem('Policy Number', 'policyNumber'));

      self.basicInformation = [financialData, insuranceData];
    }

    function InfoItem(label, columnName, modes, viewTemplate, editTemplate) {
      this.label = label + ':';
      this.columnName = columnName;
      this.template = viewTemplate;
      this.editTemplate = editTemplate;
      this.modes = (!!modes) ? modes : 'EV';
    }
  }
}());