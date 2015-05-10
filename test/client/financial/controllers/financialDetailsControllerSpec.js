(function() {
  'use strict';

  describe('financialDetailsController', function() {
    var $controllerConstructor;

    var editorModes;

    var mockFinancialAccount;
    var mockFinancialAccountEditor;
    var mockHomeAppEvent;
    var mockHomeAppEventConstructor;
    var mockRouteParams;

    beforeEach(module('app.financial'));

    beforeEach(inject(function($controller, _editorModes_) {
      $controllerConstructor = $controller;
      editorModes = _editorModes_;
    }));

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
        financialAccountEditor: mockFinancialAccountEditor,
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
        mockFinancialAccount.get.returns({_id: 73});
        controller = createController();
        controller.transactions = [{}, {}, {}];
      });

      it('creates a new transaction event for the current account', function() {
        controller.addTransaction();
        expect(mockHomeAppEventConstructor.calledOnce).to.be.true;
        expect(mockHomeAppEvent.eventType).to.equal('transaction');
        expect(mockHomeAppEvent.accountRid).to.equal(73);
      });

      it('adds the new event to the front of the transaction list', function() {
        controller.addTransaction();
        expect(controller.transactions.length).to.equal(4);
        expect(controller.transactions[0]).to.equal(mockHomeAppEvent);
      });

      it('puts the new event in edit mode', function() {
        controller.addTransaction();
        expect(mockHomeAppEvent.editMode).to.be.true;
      });

      it('puts the controller in edit mode', function() {
        controller.addTransaction();
        expect(controller.editMode).to.be.true;
      });
    });

    describe('updating a transaction', function() {
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

      it('puts the new event in edit mode', function() {
        controller.editTransaction(controller.transactions[1]);
        expect(controller.transactions[1].editMode).to.be.true;
      });

      it('puts the controller in edit mode', function() {
        controller.editTransaction(controller.transactions[1]);
        expect(controller.editMode).to.be.true;
      });

      it('copies the model data to the editor model', function() {
        controller.editTransaction(controller.transactions[1]);
        expect(controller.transactionEditor).to.deep.equal({
          description: 'Deposit #1',
          date: '2015-03-14',
          principal: 7384.09,
          interest: 0.05
        });
      });
    });

    describe('saving a transaction', function() {
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
          eventType: 'transaction',
          $save: sinon.stub()
        }, {
          _id: 314159,
          description: 'Deposit #2',
          transactionDate: '2015-04-25',
          principalAmount: 1125.89,
          interestAmount: 0.09,
          eventType: 'transaction'
        }];
        controller.editTransaction(controller.transactions[1]);
      });

      it('copies the data from the editor model to the resource', function() {
        controller.transactionEditor = {
          description: 'Historical Deposit #12',
          date: '2012-06-17',
          principal: '44395.93',
          interest: '0.12'
        };
        controller.saveTransaction(controller.transactions[1]);
        expect(controller.transactions[1].description).to.equal('Historical Deposit #12');
        expect(controller.transactions[1].transactionDate).to.equal('2012-06-17');
        expect(controller.transactions[1].principalAmount).to.equal(44395.93);
        expect(controller.transactions[1].interestAmount).to.equal(0.12);
      });

      it(' removes the editMode flag from the resource', function() {
        controller.transactions[1].editMode = true;
        controller.saveTransaction(controller.transactions[1]);
        expect(controller.transactions[1].editMode).to.be.undefined;
      });

      it('calls $save on the resource', function() {
        controller.saveTransaction(controller.transactions[1]);
        expect(controller.transactions[1].$save.calledOnce).to.be.true;
      });

      it('takes the controller out of edit mode if the save succeeds', function() {
        controller.saveTransaction(controller.transactions[1]);
        controller.transactions[1].$save.yield();
        expect(!!controller.editMode).to.be.false;
      });

      it('leaves the controller in edit mode and puts the resource back into edit mode if the save fails', function() {
        controller.saveTransaction(controller.transactions[1]);
        controller.transactions[1].$save.callArg(1);
        expect(!!controller.editMode).to.be.true;
      });

      it('restores the data to the model if the save fails', function() {
        controller.transactionEditor = {
          description: 'Historical Deposit #12',
          date: '2012-06-17',
          principal: 44395.93,
          interest: 0.12
        };
        controller.saveTransaction(controller.transactions[1]);
        controller.transactions[1].$save.callArg(1);
        expect(controller.transactions[1].description).to.equal('Deposit #1');
        expect(controller.transactions[1].transactionDate).to.equal('2015-03-14');
        expect(controller.transactions[1].principalAmount).to.equal(7384.09);
        expect(controller.transactions[1].interestAmount).to.equal(0.05);
        expect(controller.transactions[1].editMode).to.be.true;
      });
    });

    describe('editing the account', function() {
      var account;
      var controller;
      beforeEach(function() {
        account = {
          _id: 42,
          name: 'The Ultimate Account',
          otherInfo: 'This is random other information that may be on the account'
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
          otherInfo: 'This is random other information that may be on the account'
        }, editorModes.modify)).to.be.true;
      });

      it('is performed on a copy of the account', function() {
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