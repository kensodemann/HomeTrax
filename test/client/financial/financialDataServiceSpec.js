(function() {
  'use strict';

  describe('financialDataService', function() {
    var mockFinancialAccount;
    var dataService;
    var scope;
    var testData;

    beforeEach(module('app.financial'));

    beforeEach(function() {
      initializeTestData();
      mockFinancialAccount = sinon.stub({
        query: function() {}
      });
      mockFinancialAccount.query.returns(testData);

      module(function($provide) {
        $provide.value('FinancialAccount', mockFinancialAccount);
      });
    });

    beforeEach(inject(function($rootScope, financialDataService) {
      scope = $rootScope;
      dataService = financialDataService;
    }));

    it('exists', function() {
      expect(dataService).to.exist;
    });

    describe('load', function() {
      it('calls the resource query', function() {
        dataService.load();
        expect(mockFinancialAccount.query.calledOnce).to.be.true;
      });

      it('assigns the results of the query to allAccounts', function() {
        dataService.load();
        expect(dataService.allAccounts).to.deep.equal(testData);
      });

      it('only calls the resource query if it has not already been called', function() {
        dataService.load();
        dataService.load();
        expect(mockFinancialAccount.query.calledOnce).to.be.true;
      });

      it('returns the promise from the fetch', function() {
        var p = dataService.load();
        expect(p).to.equal(testData.$promise);
      });
    });

    function initializeTestData() {
      var mockPromise = sinon.stub({
        then: function() {}
      });

      testData = [{
        _id: 1,
        name: 'Test Account #1',
        balanceType: 'liability',
        amount: 175994.59
      }, {
        _id: 2,
        name: 'Test Account #2',
        balanceType: 'asset',
        amount: 1650000.00
      }, {
        _id: 3,
        name: 'Test Account #3',
        balanceType: 'asset',
        amount: 10395.49
      }, {
        _id: 4,
        name: 'Test Account #4',
        balanceType: 'liability',
        amount: 1358.05
      }, {
        _id: 5,
        name: 'Test Account #5',
        balanceType: 'liability',
        amount: 10495.95
      }, {
        _id: 6,
        name: 'Test Account #6',
        balanceType: 'asset',
        amount: 1534.95
      }, {
        _id: 7,
        name: 'Test Account #7',
        balanceType: 'liability',
        amount: 13004.42
      }];
      testData.$promise = mockPromise;
    }
  });
}());