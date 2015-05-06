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

    });
  });
}());