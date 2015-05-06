(function() {
  'use strict';

  describe('financialDetailsController', function() {
    var $controllerConstructor;
    var mockFinancialAccount;
    var mockHomeAppEvent;
    var mockHomeAppEventConstructor;
    var mockRouteParams;

    beforeEach(module('app.financial'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    beforeEach(function() {
      mockRouteParams = {};
      mockFinancialAccount = sinon.stub({
        get: function() {}
      });
    });

    beforeEach(function() {
      mockHomeAppEvent = sinon.stub({
        $save: function() {}
      });
      mockHomeAppEventConstructor = sinon.stub().returns(mockHomeAppEvent);
      mockHomeAppEventConstructor.query = sinon.stub();
    });

    function createController() {
      return $controllerConstructor('financialDetailsController', {
        $routeParams: mockRouteParams,
        FinancialAccount: mockFinancialAccount,
        HomeAppEvent: mockHomeAppEventConstructor
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activation', function() {
      it('gets the specified item', function() {
        mockRouteParams.id = 42;
        createController();
        expect(mockFinancialAccount.get.calledOnce).to.be.true;
        expect(mockFinancialAccount.get.calledWith({id: 42})).to.be.true;
      });

      it('queries the transaction events for this account', function() {
        mockRouteParams.id = 73;
        createController();
        expect(mockHomeAppEventConstructor.query.calledOnce).to.be.true;
        expect(mockHomeAppEventConstructor.query.calledWith({
          accountRid: 73,
          eventType: 'transaction'
        })).to.be.true;
      });
    });

    describe('adding a transaction', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        controller.transactions = [{}, {}, {}];
      });

      it('creates a new transaction event', function() {
        controller.addTransaction();
        expect(mockHomeAppEventConstructor.calledOnce).to.be.true;
        expect(mockHomeAppEvent.eventType).to.equal('transaction');
      });

      it('adds the new event to the front of the transaction list', function(){
        controller.addTransaction();
        expect(controller.transactions.length).to.equal(4);
        expect(controller.transactions[0]).to.equal(mockHomeAppEvent);
      });

      it('puts the new event in edit mode', function(){
        controller.addTransaction();
        expect(mockHomeAppEvent.editMode).to.be.true;
      });

      it('puts the controller in edit mode', function(){
        controller.addTransaction();
        expect(controller.editMode).to.be.true;
      });
    });

    describe('updating a transaction', function(){
      var controller;
      beforeEach(function() {
        controller = createController();
        controller.transactions = [{
          _id: 42,
          description: 'Withdrawl #1',
          transactionDate: '2015-01-15',
          principalAmount: -123.04,
          interestAmount: 0,
          eventType: 'transaction'
        }, {
          _id: 73,
          description: 'Deposit #1',
          transactionDate: '2015-03-14',
          principalAmount: 7384.09,
          interestAmount: 0.05,
          eventType: 'transaction'
        }, {
          _id: 314159,
          description: 'Deposit #2',
          transactionDate: '2015-04-25',
          principalAmount: 1125.89,
          interestAmount: 0.09,
          eventType: 'transaction'
        }];
      });


    });
  });
}());