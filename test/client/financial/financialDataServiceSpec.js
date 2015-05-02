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

    describe('init', function() {
      it('calls the resource query', function() {
        dataService.init();
        expect(mockFinancialAccount.query.calledOnce).to.be.true;
      });

      it('assigns the results of the query to allAccounts', function(){
        dataService.init();
        expect(dataService.allAccounts).to.deep.equal(testData);
      });

      it('only calls the resource query if it has not already been called', function(){
        dataService.init();
        dataService.init();
        expect(mockFinancialAccount.query.calledOnce).to.be.true;
      });
    });

    function initializeTestData() {
      testData = [{
        _id: 1,
        name: 'Test Account #1'
      }, {
        _id: 2,
        name: 'Test Account #2'
      }, {
        _id: 3,
        name: 'Test Account #3'
      }, {
        _id: 4,
        name: 'Test Account #4'
      }, {
        _id: 5,
        name: 'Test Account #5'
      }, {
        _id: 6,
        name: 'Test Account #6'
      }, {
        _id: 7,
        name: 'Test Account #7'
      }];
    }
  });
}());