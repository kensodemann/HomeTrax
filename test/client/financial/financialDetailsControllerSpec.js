(function() {
  'use strict';

  describe('financialDetailsController', function() {
    var $controllerConstructor;
    var mockFinancialAccount;
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

    function createController() {
      return $controllerConstructor('financialDetailsController', {
        $routeParams: mockRouteParams,
        FinancialAccount: mockFinancialAccount
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
    });
  });
}());