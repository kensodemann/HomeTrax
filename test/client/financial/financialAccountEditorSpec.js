(function() {
  'use strict';

  describe('financialAccountEditor', function() {
    var financialAccountTypes;
    var mockModal;
    var mockModalConstructor;
    var finacialAccountEditor;
    var scope;

    beforeEach(module('app.financial'));

    beforeEach(function() {
      buildMockModal();

      module(function($provide) {
        $provide.value('$modal', mockModalConstructor);
      });
    });

    function buildMockModal() {
      var mockPromise = sinon.stub({
        then: function() {}
      });

      mockModal = sinon.stub({
        $promise: mockPromise,
        hide: function() {},
        show: function() {}
      });
      mockModalConstructor = sinon.stub().returns(mockModal);
    }

    function getEditorScope() {
      return mockModalConstructor.getCall(0).args[0].scope;
    }

    function getEditorController() {
      return getEditorScope().controller;
    }

    beforeEach(inject(function($rootScope, _financialAccountEditor_, _financialAccountTypes_) {
      scope = $rootScope;
      financialAccountTypes = _financialAccountTypes_;
      finacialAccountEditor = _financialAccountEditor_;
    }));


    it('exists', function() {
      expect(finacialAccountEditor).to.exist;
    });

    describe('Instantiation', function() {
      it('constructs a modal dialog', function() {
        expect(mockModalConstructor.calledOnce).to.be.true;
      });

      it('constructs a scope with a controller object', function() {
        var controller = getEditorController();
        expect(controller).to.exist;
      });

      it('puts the account types on the controller', function() {
        var controller = getEditorController();
        expect(controller.accountTypes).to.deep.equal(financialAccountTypes);
      });

      it('uses a static backdrop', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.backdrop).to.equal('static');
      });

      it('uses the correct template', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.template).to.equal('/partials/financial/editor/template');
      });

      it('is initially hidden', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.show).to.be.false;
      });
    });

    describe('Opening the editor', function() {
      var testAccount;
      beforeEach(function() {
        testAccount = {
          name: 'Mortgage',
          bank: 'Eastern World Bank',
          accountNumber: '1399405-2093',
          accountType: financialAccountTypes[4].accountType,
          balanceType: financialAccountTypes[4].balanceType,
          amount: 176940.43
        };
      });

      it('does not show the dialog if it is not ready', function() {
        finacialAccountEditor.open({}, 'anything');
        expect(mockModal.show.called).to.be.false;
      });

      it('shows the dialog if it is ready', function() {
        finacialAccountEditor.open({}, 'anything');
        mockModal.$promise.then.yield();
        expect(mockModal.show.calledOnce).to.be.true;
      });

      it('sets the title to Modify Account if the mode is "edit"', function() {
        var controller = getEditorController();
        finacialAccountEditor.open({}, 'edit');
        expect(controller.title).to.equal('Modify Account');
      });

      it('sets the title to New Account if the mode is "create"', function() {
        var controller = getEditorController();
        finacialAccountEditor.open({}, 'create');
        expect(controller.title).to.equal('New Account');
      });

      it('copies the data from the passed model to the controller', function() {
        var controller = getEditorController();
        finacialAccountEditor.open(testAccount, 'any');
        expect(controller.name).to.equal(testAccount.name);
        expect(controller.bank).to.equal(testAccount.bank);
        expect(controller.accountNumber).to.equal(testAccount.accountNumber);
        expect(controller.accountType).to.equal(financialAccountTypes[4]);
        expect(controller.amount).to.equal(testAccount.amount);
      });

      it('uses the first account type if the model is unknown', function() {
        var controller = getEditorController();
        testAccount.accountType = 'bogus';
        finacialAccountEditor.open(testAccount, 'any');
        expect(controller.accountType).to.equal(financialAccountTypes[0]);
      });

      it('uses the first account type if the model is new', function() {
        var controller = getEditorController();
        finacialAccountEditor.open({}, 'any');
        expect(controller.accountType).to.equal(financialAccountTypes[0]);
      });
    });

    describe('Saving the account', function() {
      var mockAccount;
      var controller;
      beforeEach(function() {
        mockAccount = sinon.stub({
          $save: function() {}
        });
        controller = getEditorController();
        finacialAccountEditor.open(mockAccount, "itDontMatterNone");
      });

      it('copies the data from the editor controller to the account resource', function() {
        controller.name = 'Bill & Ted';
        controller.bank = 'The Excellent Bank';
        controller.accountNumber = '399405-039950-01';
        controller.accountType = financialAccountTypes[2];
        controller.amount = 42.03;

        controller.save();

        expect(mockAccount.name).to.equal('Bill & Ted');
        expect(mockAccount.bank).to.equal('The Excellent Bank');
        expect(mockAccount.accountNumber).to.equal('399405-039950-01');
        expect(mockAccount.accountType).to.equal(financialAccountTypes[2].accountType);
        expect(mockAccount.balanceType).to.equal(financialAccountTypes[2].balanceType);
        expect(mockAccount.amount).to.equal(42.03);
      });

      it('calls save on the account', function() {
        controller.save();
        expect(mockAccount.$save.calledOnce).to.be.true;
      });

      it('closes the editor if the save succeeds', function() {
        controller.save();
        mockAccount.$save.yield();
        expect(mockModal.hide.calledOnce).to.be.true;
      });

      it('sets the error text and leaves the editor open if the save fails', function() {
        controller.save();
        mockAccount.$save.callArgWith(1, {
          status: 400,
          statusText: 'something went wrong',
          data: {
            reason: 'because you suck eggs'
          }
        });

        expect(controller.errorMessage).to.equal('because you suck eggs');
        expect(mockModal.hide.called).to.be.false;
      });
    });
  });
}());