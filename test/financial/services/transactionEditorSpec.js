(function() {
  'use strict';

  describe('transactionEditor', function() {
    var editorModes;

    var mockModal;
    var mockModalConstructor;

    var scope;
    var transactionEditor;
    var transactionTypes;

    beforeEach(module('app.financial'));

    beforeEach(function() {
      module(function($provide) {
        buildMockModal();
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

    beforeEach(inject(function($rootScope, _transactionEditor_, _editorModes_, _transactionTypes_) {
      scope = $rootScope;
      transactionEditor = _transactionEditor_;
      editorModes = _editorModes_;
      transactionTypes = _transactionTypes_;
    }));

    it('Should exist', function() {
      expect(transactionEditor).to.exist;
    });

    describe('Instantiation', function() {
      it('constructs a modal dialog', function() {
        expect(mockModalConstructor.calledOnce).to.be.true;
      });

      it('constructs a scope with a controller object', function() {
        var controller = getEditorController();
        expect(controller).to.exist;
      });

      it('puts the transaction types on the controller', function() {
        var controller = getEditorController();
        expect(controller.transactionTypes).to.equal(transactionTypes);
      });

      it('uses a static backdrop', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.backdrop).to.equal('static');
      });

      it('uses the correct template', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.template).to.equal('app/financial/transactionEditor/template.html');
      });

      it('is initially hidden', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.show).to.be.false;
      });
    });

    describe('Opening the editor', function() {
      var testTransaction;
      beforeEach(function() {
        testTransaction = {
          transactionDate: '2015-05-14',
          description: 'This is a test',
          principalAmount: 1095.93,
          interestAmount: 123.28
        };
      });

      it('does not show the dialog if it is not ready', function() {
        transactionEditor.open({}, {}, 'anything');
        expect(mockModal.show.called).to.be.false;
      });

      it('shows the dialog if it is ready', function() {
        transactionEditor.open({}, {}, 'anything');
        mockModal.$promise.then.yield();
        expect(mockModal.show.calledOnce).to.be.true;
      });

      it('puts the passed account on the controller so it can be read', function() {
        var controller = getEditorController();
        transactionEditor.open({_id: 42, name: 'I am the account'},
          {_id: 73, name: 'I am the transaction'}, 'anything');
        expect(controller.account).to.deep.equal({_id: 42, name: 'I am the account'});
      });

      it('sets the title to Modify Account if the mode is modify', function() {
        var controller = getEditorController();
        transactionEditor.open({}, {}, editorModes.modify);
        expect(controller.title).to.equal('Modify Transaction');
      });

      it('sets the title to New Account if the mode is "create"', function() {
        var controller = getEditorController();
        transactionEditor.open({}, {}, editorModes.create);
        expect(controller.title).to.equal('New Transaction');
      });

      it('copies the data from the passed model to the controller', function() {
        var controller = getEditorController();
        transactionEditor.open({}, testTransaction, 'any');
        expect(controller.transactionDate).to.equal(testTransaction.transactionDate);
        expect(controller.description).to.equal(testTransaction.description);
        expect(controller.principalAmount).to.equal(testTransaction.principalAmount);
        expect(controller.interestAmount).to.equal(testTransaction.interestAmount);
      });
    });

    describe('Saving the transaction', function() {
      var mockTransaction;
      var controller;
      var theSaveCompleted;
      var savedTransaction;

      beforeEach(function() {
        theSaveCompleted = false;
        savedTransaction = undefined;
        mockTransaction = sinon.stub({
          $save: function() {}
        });
        controller = getEditorController();
        transactionEditor.open({}, mockTransaction, "itDontMatterNone", saveCompleted);
      });

      function saveCompleted(trans) {
        theSaveCompleted = true;
        savedTransaction = trans;
      }

      it('copies the data from the editor controller to the transaction resource', function() {
        controller.transactionDate = '2015-05-11T05:00:00.000Z';
        controller.description = 'This is a transaction';
        controller.principalAmount = '4313.04';
        controller.interestAmount = '42.03';

        controller.save();

        expect(mockTransaction.transactionDate).to.equal('2015-05-11T05:00:00.000Z');
        expect(mockTransaction.description).to.equal('This is a transaction');
        expect(mockTransaction.principalAmount).to.equal(4313.04);
        expect(mockTransaction.interestAmount).to.equal(42.03);
      });

      it('calls save on the transaction', function() {
        controller.save();
        expect(mockTransaction.$save.calledOnce).to.be.true;
      });

      it('closes the editor if the save succeeds', function() {
        controller.save();
        mockTransaction.$save.yield();
        expect(mockModal.hide.calledOnce).to.be.true;
      });

      it('calls the save callback with the new transaction if the save succeeds', function() {
        controller.save();
        mockTransaction.$save.yield(mockTransaction);
        expect(theSaveCompleted).to.be.true;
        expect(savedTransaction).to.equal(mockTransaction);
      });

      it('sets the error text and leaves the editor open if the save fails', function() {
        controller.save();
        mockTransaction.$save.callArgWith(1, {
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
  
  