/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('userEditor', function() {
    var serviceUnderTest;
    var scope;

    var mockModal;
    var mockModalConstructor;
    var mockNotifier;
    var mockUser;

    beforeEach(module('app.account'));

    beforeEach(function() {
      buildMockModal();
      buildMockNotifier();
      buildMockUser();

      module(function($provide) {
        $provide.value('$modal', mockModalConstructor);
        $provide.value('notifier', mockNotifier);
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

      function buildMockNotifier() {
        mockNotifier = sinon.stub({
          notify: function() {},
          error: function() {}
        });
      }

      function buildMockUser() {
        mockUser = sinon.stub({
          $save: function() {},
          $update: function() {}
        });
      }
    });

    beforeEach(inject(function($rootScope, userEditor) {
      scope = $rootScope;
      serviceUnderTest = userEditor;
    }));

    it('Should exist', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    function getEditorCtrl() {
      return mockModalConstructor.getCall(0).args[0].scope.ctrl;
    }

    describe('Editor Instantiation', function() {
      it('is constructed', function() {
        expect(mockModalConstructor.calledOnce).to.be.true;
      });

      it('has a scope with a ctrl object', function() {
        var ctrl = getEditorCtrl();
        expect(ctrl).to.not.be.undefined;
      });

      it('uses a static backdrop', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.backdrop).to.equal('static');
      });

      it('uses the correct template', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.template).to.equal('/partials/account/templates/userEditor');
      });

      it('is initially hidden', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.show).to.be.false;
      });
    });

    describe('opening the editor', function() {
      var ctrl;
      beforeEach(function() {
        ctrl = getEditorCtrl();
      });

      it('does not show the editor if the modal is not ready', function() {
        serviceUnderTest.open(mockUser, 'anything');
        expect(mockModal.show.called).to.be.false;
      });

      it('shows the editor if the modal is ready', function() {
        serviceUnderTest.open(mockUser, 'anything');
        mockModal.$promise.then.yield();
        expect(mockModal.show.calledOnce).to.be.true;
      });

      it('sets the mode to whatever is passed', function() {
        serviceUnderTest.open(mockUser, 'edit');
        expect(ctrl.mode).to.equal('edit');
        serviceUnderTest.open(mockUser, 'create');
        expect(ctrl.mode).to.equal('create');
      });

      it('sets the title to "Edit User" if mode is "edit"', function() {
        serviceUnderTest.open(mockUser, 'edit');
        expect(ctrl.title).to.equal('Edit User');
      });

      it('sets the title to "Create User" if mode is "create"', function() {
        serviceUnderTest.open(mockUser, 'create');
        expect(ctrl.title).to.equal('Create User');
      });

      it('sets the button label to "Save" if mode is "edit"', function() {
        serviceUnderTest.open(mockUser, 'edit');
        expect(ctrl.saveLabel).to.equal('Save');
      });

      it('sets the button label to "Create" if mode is "create"', function() {
        serviceUnderTest.open(mockUser, 'create');
        expect(ctrl.saveLabel).to.equal('Create');
      });

      it('populates the model for the editor', function() {
        mockUser.firstName = 'Billy';
        mockUser.lastName = 'Jackson';
        mockUser.username = 'email@me.com';
        serviceUnderTest.open(mockUser, 'Anything');
        expect(ctrl.model).to.not.equal(mockUser);
        expect(ctrl.model.firstName).to.equal('Billy');
        expect(ctrl.model.lastName).to.equal('Jackson');
        expect(ctrl.model.username).to.equal('email@me.com');
      });
    });

    describe('saving', function() {
      var ctrl;
      var callback;
      beforeEach(function() {
        ctrl = getEditorCtrl();
        callback = sinon.stub();
      });

      describe('existing user', function() {
        beforeEach(function() {
          serviceUnderTest.open(mockUser, 'edit');
        });

        it('copies data back to the resource', function() {
          ctrl.model.firstName = 'Wilma';
          ctrl.model.lastName = 'Rubble';
          ctrl.model.username = 'wife@swap.com';
          ctrl.model.password = 'spiceItUpABit';
          ctrl.save();
          expect(mockUser.firstName).to.equal('Wilma');
          expect(mockUser.lastName).to.equal('Rubble');
          expect(mockUser.username).to.equal('wife@swap.com');
          expect(mockUser.password).to.be.undefined;
        });

        it('calls $update on the resource', function() {
          ctrl.save();
          expect(mockUser.$update.calledOnce).to.be.true;
          expect(mockUser.$save.called).to.be.false;
        });

        it('notifies the user on success', function() {
          ctrl.save();
          mockUser.$update.callArg(0);
          expect(mockNotifier.notify.calledOnce).to.be.true;
          expect(mockNotifier.notify.calledWith("Changes to user saved successfully")).to.be.true;
        });

        it('closes on success', function() {
          ctrl.save();
          mockUser.$update.callArg(0);
          expect(mockModal.hide.calledOnce).to.be.true;
        });

        it('notifies the user on failure', function() {
          ctrl.save();
          mockUser.$update.callArg(1, {
            data: 'You are a sucky sucky failure'
          });
          expect(mockNotifier.error.calledOnce).to.be.true;
          expect(mockNotifier.error.calledWith("You are a sucky sucky failure")).to.be.true;
        });

        it('does not close on failure', function() {
          ctrl.save();
          mockUser.$update.callArg(1, {
            data: 'You are a sucky sucky failure'
          });
          expect(mockModal.hide.called).to.be.false;
        });
      });

      describe('new user', function() {
        beforeEach(function() {
          serviceUnderTest.open(mockUser, 'create');
        });

        it('copies data back to the resource', function() {
          ctrl.model.firstName = 'Betty';
          ctrl.model.lastName = 'Flintstone';
          ctrl.model.username = 'wife.swap@too.com';
          ctrl.model.password = 'spiceItUpABit';
          ctrl.save();
          expect(mockUser.firstName).to.equal('Betty');
          expect(mockUser.lastName).to.equal('Flintstone');
          expect(mockUser.username).to.equal('wife.swap@too.com');
          expect(mockUser.password).to.equal('spiceItUpABit');
        });

        it('calls $save on the resource', function() {
          ctrl.save();
          expect(mockUser.$update.called).to.be.false;
          expect(mockUser.$save.calledOnce).to.be.true;
        });

        it('notifies the user on success', function() {
          ctrl.save();
          mockUser.$save.callArg(0);
          expect(mockNotifier.notify.calledOnce).to.be.true;
          expect(mockNotifier.notify.calledWith("User created successfully")).to.be.true;
        });

        it('closes on success', function() {
          ctrl.save();
          mockUser.$save.callArg(0);
          expect(mockModal.hide.calledOnce).to.be.true;
        });

        it('notifies the user on failure', function() {
          ctrl.save();
          mockUser.$save.callArg(1, {
            data: 'You are a sucky sucky failure'
          });
          expect(mockNotifier.error.calledOnce).to.be.true;
          expect(mockNotifier.error.calledWith("You are a sucky sucky failure")).to.be.true;
        });

        it('does not close on failure', function() {
          ctrl.save();
          mockUser.$save.callArg(1, {
            data: 'You are a sucky sucky failure'
          });
          expect(mockModal.hide.called).to.be.false;
        });
      });

      describe('onSave callback', function() {
        beforeEach(function() {
          serviceUnderTest.open(mockUser, 'create');
        });

        it('is called if specified and save succeeds', function() {
          serviceUnderTest.open(mockUser, 'create', callback);
          ctrl.save();
          mockUser.$save.callArg(0);
          expect(callback.calledOnce).to.be.true;
          expect(callback.calledWith(mockUser)).to.be.true;
        });

        it('is not called if not specified but save succeeds', function() {
          serviceUnderTest.open(mockUser, 'create');
          ctrl.save();
          mockUser.$save.callArg(0);
          expect(callback.called).to.be.false;
        });

        it('is not called if specified but save fails', function() {
          serviceUnderTest.open(mockUser, 'create', callback);
          ctrl.save();
          mockUser.$save.callArg(1, {
            data: 'You are a sucky sucky failure'
          });
          expect(callback.called).to.be.false;
        });
      });
    });
  });
}());