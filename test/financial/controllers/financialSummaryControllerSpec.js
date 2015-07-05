(function() {
  'use strict';

  describe('financialSummaryController', function() {
    var $controllerConstructor;
    var mockFinancialAccount;
    var mockFinancialAccountConstructor;
    var mockFinancialAccountEditor;
    var testData;

    beforeEach(module('app.financial'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    beforeEach(function() {
      initializeTestData();

      mockFinancialAccount = {};
      mockFinancialAccountConstructor = sinon.stub().returns(mockFinancialAccount);
      mockFinancialAccountConstructor.query = sinon.stub();

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
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activiation', function() {
      it('queries the financial accounts', function() {
        createController();
        expect(mockFinancialAccountConstructor.query.calledOnce).to.be.true;
      });

      it('creates the liability and asset auth lists', function(){
        var controller = createController();
        mockFinancialAccountConstructor.query.yield(testData);
        expect(controller.liabilityAccounts.length).to.equal(4);
        expect(controller.liabilityAccounts[0]).to.equal(testData[0]);
        expect(controller.liabilityAccounts[1]).to.equal(testData[3]);
        expect(controller.liabilityAccounts[2]).to.equal(testData[4]);
        expect(controller.liabilityAccounts[3]).to.equal(testData[6]);
        expect(controller.assetAccounts.length).to.equal(3);
        expect(controller.assetAccounts[0]).to.equal(testData[1]);
        expect(controller.assetAccounts[1]).to.equal(testData[2]);
        expect(controller.assetAccounts[2]).to.equal(testData[5]);
      });
    });

    describe('Adding a new event', function() {
      it('creates a new auth', function() {
        var controller = createController();
        controller.addAccountClicked();
        expect(mockFinancialAccountConstructor.calledOnce).to.be.true;
      });

      it('opens the auth editor passing the new auth', function() {
        var controller = createController();
        controller.addAccountClicked();
        expect(mockFinancialAccountEditor.open.calledOnce).to.be.true;
        expect(mockFinancialAccountEditor.open.calledWith(mockFinancialAccount, 'create')).to.be.true;
      });

      it('adds the auth to the asset list if it is an asset auth', function(){
        var controller = createController();
        controller.addAccountClicked();
        mockFinancialAccountEditor.open.callArgWith(2, {name:'bob', balanceType: 'liability'});
        expect(controller.assetAccounts.length).to.equal(0);
        expect(controller.liabilityAccounts.length).to.equal(1);
      });

      it('adds the auth to the asset list if it is an asset auth', function(){
        var controller = createController();
        controller.addAccountClicked();
        mockFinancialAccountEditor.open.callArgWith(2, {name:'brian', balanceType: 'asset'});
        expect(controller.assetAccounts.length).to.equal(1);
        expect(controller.liabilityAccounts.length).to.equal(0);
      });
    });

    function initializeTestData(){
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
    }
  });
}());