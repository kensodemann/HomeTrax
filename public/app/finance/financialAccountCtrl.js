(function() {
  'use strict';

// In combination with this: http://www.bennadel.com/blog/2450-using-ngcontroller-with-ngrepeat-in-angularjs.htm
// This could be used to do an editable table (I am thinking about for the account transactions, etc.)
  angular.module('app').controller('financialAccountCtrl', FinancialAccountCtrl);

  function FinancialAccountCtrl($location) {
    var self = this;

    self.message = "Hello World from the Angular Financial Account Controller!!";
    self.subtext = "This is some more text.";
    self.accountName = ($location.search()).acct;

    self.messageClicked = function() {
      self.editMode = 'message';
    };

    self.subtextClicked = function() {
      self.editMode = 'subtext';
    };

    self.handleChange = function() {
      self.editMode = '';
    };
  }
}());