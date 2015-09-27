(function() {
  'use strict';

  describe('passwordEditor', function() {
    var serviceUnderTest;

    var mockModal;
    var mockModalConstructor;
    var mockNotifier;
    var mockUserPassword;
    var mockUserPasswordConstructor;

    beforeEach(module('homeTrax.userAdministration'));

    beforeEach(function() {
      buildMockModal();
      buildMockNotifier();
      buildMockUserPassword();

      module(function($provide) {
        $provide.value('$modal', mockModalConstructor);
        $provide.value('notifier', mockNotifier);
        $provide.value('UserPassword', mockUserPasswordConstructor);
      });
    });

    function buildMockModal() {
      mockModal = sinon.stub({
        hide: function() {
        },

        show: function() {
        }
      });
      mockModalConstructor = sinon.stub().returns(mockModal);
    }

    function buildMockUserPassword() {
      mockUserPassword = sinon.stub({
        $update: function() {
        }
      });
      mockUserPasswordConstructor = sinon.stub().returns(mockUserPassword);
    }

    function buildMockNotifier() {
      mockNotifier = sinon.stub({
        notify: function() {
        },

        error: function() {
        }
      });
    }

    beforeEach(inject(function(passwordEditor) {
      serviceUnderTest = passwordEditor;
    }));

    it('Should exist', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    function getCtrl() {
      return mockModalConstructor.getCall(0).args[0].scope.controller;
    }

    describe('instantiation', function() {
      it('sets the password model', function() {
        var controller = getCtrl();
        expect(controller.model).to.equal(mockUserPassword);
      });
    });

    describe('open', function() {
      it('opens the modal dialog', function() {
        serviceUnderTest.open(42);
        expect(mockModal.show.calledOnce).to.be.true;
      });

      it('sets the _id on to model', function() {
        var controller = getCtrl();
        serviceUnderTest.open(42);
        expect(controller.model._id).to.equal(42);
      });

      it('clears the model data', function(){
        var controller = getCtrl();
        controller.model = {
          password: 'something',
          newPassword: 'somethingElse',
          verifyPassword: 'somethingElse'
        };
        serviceUnderTest.open(42);
        expect(controller.model.password).to.equal('');
        expect(controller.model.newPassword).to.equal('');
        expect(controller.model.verifyPassword).to.equal('');
      });
    });

    describe('setting new password', function() {
      var controller;
      beforeEach(function() {
        controller = getCtrl();
      });

      it('updates password', function() {
        controller.setPassword();
        expect(controller.model.$update.calledOnce).to.be.true;
      });

      it('notifies user on password change success', function() {
        controller.setPassword();
        resolvePasswordUpdate();
        expect(mockNotifier.notify.calledOnce).to.be.true;
        expect(mockNotifier.notify.calledWith('Password changed successfully')).to.be.true;
      });

      it('closes the editor on success', function() {
        controller.setPassword();
        resolvePasswordUpdate();
        expect(mockModal.hide.calledOnce).to.be.true;
      });

      it('notifies user if http request fails', function() {
        controller.setPassword();
        rejectPasswordUpdate();

        expect(controller.errorMessage).to.equal('because you suck eggs');
        expect(mockNotifier.error.calledOnce).to.be.true;
        expect(mockNotifier.error.calledWith('because you suck eggs')).to.be.true;
        expect(mockModal.hide.called).to.be.false;
      });

      function resolvePasswordUpdate() {
        controller.model.$update.callArgWith(0, controller.model);
      }

      function rejectPasswordUpdate() {
        controller.model.$update.callArgWith(1, {
          status: 400,
          statusText: 'something went wrong',
          data: {
            reason: 'because you suck eggs'
          }
        });
      }
    });
  });
}());
  
  