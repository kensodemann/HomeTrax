(function() {
  'use strict';

  describe('financialSummaryController', function() {
    var $controllerConstructor;
    var mockFinancialAccount;
    var mockFinancialAccountConstructor;
    var mockFinancialAccountEditor;

    beforeEach(module('app.financial'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    beforeEach(function() {
      mockFinancialAccount = sinon.stub({
        query: function() {}
      });
      mockFinancialAccountConstructor = sinon.stub().returns(mockFinancialAccount);

      mockFinancialAccountEditor = sinon.stub({
        open: function() {}
      });
    });

    function createController() {
      return $controllerConstructor('financialSummaryController', {
        FinancialAccount: mockFinancialAccountConstructor,
        financialAccountEditor: mockFinancialAccountEditor
      });
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.exist;
    });

    describe('Adding a new event', function() {
      it('creates a new account', function() {
        var controller = createController();
        controller.addAccountClicked();
        expect(mockFinancialAccountConstructor.calledOnce).to.be.true;
      });

      it('opens the account editor passing the new account', function() {
        var controller = createController();
        controller.addAccountClicked();
        expect(mockFinancialAccountEditor.open.calledOnce).to.be.true;
        expect(mockFinancialAccountEditor.open.calledWith(mockFinancialAccount, 'create')).to.be.true;
      });
    });
  });
}());