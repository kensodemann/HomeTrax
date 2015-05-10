(function() {
  'use strict';

  describe('transactionEditor', function() {
    var editorModes;

    var mockModal;
    var mockModalConstructor;

    var scope;
    var transactionEditor;

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

    beforeEach(inject(function($rootScope, _transactionEditor_, _editorModes_) {
      scope = $rootScope;
      transactionEditor = _transactionEditor_;
      editorModes = _editorModes_;
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

      it('uses a static backdrop', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.backdrop).to.equal('static');
      });

      it('uses the correct template', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.template).to.equal('/partials/financial/transactionEditor/template');
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
        transactionEditor.open({}, 'anything');
        expect(mockModal.show.called).to.be.false;
      });

      //it('shows the dialog if it is ready', function() {
      //  finacialAccountEditor.open({}, 'anything');
      //  mockModal.$promise.then.yield();
      //  expect(mockModal.show.calledOnce).to.be.true;
      //});
      //
      //it('sets the title to Modify Account if the mode is modify', function() {
      //  var controller = getEditorController();
      //  finacialAccountEditor.open({}, editorModes.modify);
      //  expect(controller.title).to.equal('Modify Account');
      //});
      //
      //it('sets the title to New Account if the mode is "create"', function() {
      //  var controller = getEditorController();
      //  finacialAccountEditor.open({}, editorModes.create);
      //  expect(controller.title).to.equal('New Account');
      //});
    });
  });
}());
  
  