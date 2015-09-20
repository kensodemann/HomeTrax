(function() {
  'use strict';

  describe('financialDetailsController', function() {
    var $controllerConstructor;

    var askDfd;
    var scope;

    var editorModes;

    var mockFinancialAccount;
    var mockFinancialAccountEditor;
    var mockHomeAppEvent;
    var mockHomeAppEventConstructor;
    var mockMessageDialogService;
    var mockRouteParams;
    var mockTransactionEditor;

    beforeEach(module('app.financial'));

    beforeEach(function() {
      mockRouteParams = {};
      mockFinancialAccount = sinon.stub({
        get: function() {}
      });
    });

    beforeEach(function() {
      mockFinancialAccountEditor = sinon.stub({
        open: function() {}
      });
    });

    beforeEach(function() {
      mockTransactionEditor = sinon.stub({
        open: function() {}
      });
    });

    beforeEach(function() {
      mockHomeAppEvent = sinon.stub({
        $save: function() {}
      });
      mockHomeAppEventConstructor = sinon.stub().returns(mockHomeAppEvent);
      mockHomeAppEventConstructor.query = sinon.stub();
    });

    beforeEach(function() {
      mockMessageDialogService = sinon.stub({
        ask: function() {}
      });
    });

    beforeEach(inject(function($rootScope, $q, $controller, _editorModes_) {
      $controllerConstructor = $controller;
      editorModes = _editorModes_;
      askDfd = $q.defer();
      mockMessageDialogService.ask.returns(askDfd.promise);
      scope = $rootScope.$new(true);
    }));

    function createController() {
      return $controllerConstructor('financialDetailsController', {
        $routeParams: mockRouteParams,
        FinancialAccount: mockFinancialAccount,
        financialAccountEditor: mockFinancialAccountEditor,
        transactionEditor: mockTransactionEditor,
        HomeAppEvent: mockHomeAppEventConstructor,
        messageDialogService: mockMessageDialogService
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

      it('queries the transaction events for this auth', function() {
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
        mockFinancialAccount.get.returns({_id: 73, name: 'I am the best number, ever'});
        controller = createController();
        controller.transactions = [{}, {}, {}];
      });

      it('creates a new transaction event for the current auth', function() {
        controller.addTransaction();
        expect(mockHomeAppEventConstructor.calledOnce).to.be.true;
        expect(mockHomeAppEventConstructor.calledWith({
          eventType: 'transaction',
          accountRid: 73
        })).to.be.true;
      });

      it('opens the transaction editor', function() {
        controller.addTransaction();
        expect(mockTransactionEditor.open.calledOnce).to.be.true;
        expect(mockTransactionEditor.open.calledWith({_id: 73, name: 'I am the best number, ever'}, mockHomeAppEvent, editorModes.create)).to.be.true;
      });

      it('adds the new event to the front of the transaction list', function() {
        controller.addTransaction();
        mockTransactionEditor.open.callArg(3);
        expect(controller.transactions.length).to.equal(4);
        expect(controller.transactions[0]).to.equal(mockHomeAppEvent);
      });
    });

    describe('updating a transaction', function() {
      var controller;
      beforeEach(function() {
        mockFinancialAccount.get.returns({_id: 73, name: 'I am the best number, ever'});
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

      it('opens the transaction editor', function() {
        controller.editTransaction(controller.transactions[1]);
        expect(mockTransactionEditor.open.calledOnce).to.be.true;
        expect(mockTransactionEditor.open.calledWith({_id: 73, name: 'I am the best number, ever'}, controller.transactions[1], editorModes.edit)).to.be.true;
      });
    });

    describe('deleting a transaction', function() {
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
          eventType: 'transaction',
          $delete: sinon.stub()
        }, {
          _id: 3994850,
          description: 'Deposit #3',
          transactionDate: '2015-05-15',
          principalAmount: 1399.89,
          interestAmount: 0.08,
          eventType: 'transaction'
        }];
      });

      it('asks the user first', function(){
        controller.deleteTransaction(controller.transactions[2]);
        expect(mockMessageDialogService.ask.calledOnce).to.be.true;
        expect(mockMessageDialogService.ask.calledWith('Are you sure you want to delete this transaction?', 'Delete Transaction')).to.be.true;
      });

      it('does not call delete on the transaction if the user responds no', function(){
        controller.deleteTransaction(controller.transactions[2]);
        askDfd.resolve(false);
        scope.$digest();
        expect(controller.transactions[2].$delete.called).to.be.false;
      });

      it('calls delete on the transaction if the user responds yes', function(){
        controller.deleteTransaction(controller.transactions[2]);
        askDfd.resolve(true);
        scope.$digest();
        expect(controller.transactions[2].$delete.calledOnce).to.be.true;
      });

      it('removes the transaction from the list after the delete succeeds', function(){
        controller.deleteTransaction(controller.transactions[2]);
        askDfd.resolve(true);
        scope.$digest();
        controller.transactions[2].$delete.yield();
        expect(controller.transactions).to.deep.equal([{
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
          _id: 3994850,
          description: 'Deposit #3',
          transactionDate: '2015-05-15',
          principalAmount: 1399.89,
          interestAmount: 0.08,
          eventType: 'transaction'
        }]);
      });
    });

    describe('editing the auth', function() {
      var account;
      var controller;
      beforeEach(function() {
        account = {
          _id: 42,
          name: 'The Ultimate Account',
          otherInfo: 'This is random other information that may be on the auth'
        };
        mockFinancialAccount.get.returns(account);

        controller = createController();
        controller.editAccount();
      });

      it('opens the event editor', function() {
        expect(mockFinancialAccountEditor.open.calledOnce).to.be.true;
        expect(mockFinancialAccountEditor.open.calledWith({
          _id: 42,
          name: 'The Ultimate Account',
          otherInfo: 'This is random other information that may be on the auth'
        }, editorModes.modify)).to.be.true;
      });

      it('is performed on a copy of the auth', function() {
        expect(mockFinancialAccountEditor.open.getCall(0).args[0]).to.deep.equal(account);
        expect(mockFinancialAccountEditor.open.getCall(0).args[0]).to.not.equal(account);
      });

      it('copies changes back', function() {
        mockFinancialAccountEditor.open.callArgWith(2, {
          _id: 42,
          name: 'I am the best number, ever',
          otherInfo: 'No matter what 73 tries to tell you'
        });
        expect(account.name).to.equal('I am the best number, ever');
        expect(account.otherInfo).to.equal('No matter what 73 tries to tell you');
      });
    });
  });
}());