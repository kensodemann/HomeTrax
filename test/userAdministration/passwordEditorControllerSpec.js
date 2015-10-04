(function() {
  'use strict';

  describe('homeTrax.userAdministration: passwordEditorController', function() {
    var mockModalInstance;
    var mockNotifier;
    var mockUserPassword;
    var mockUserPasswordConstructor;
    var $controllerConstructor;

    beforeEach(module('homeTrax.userAdministration'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    beforeEach(function() {
      mockModalInstance = sinon.stub({
        close: function() {
        }
      });
    });

    beforeEach(function() {
      mockNotifier = sinon.stub({
        error: function() {
        },

        notify: function() {
        }
      });
    });

    beforeEach(function() {
      mockUserPassword = sinon.stub({
        $update: function() {
        }
      });
      mockUserPasswordConstructor = sinon.stub();
      mockUserPasswordConstructor.returns(mockUserPassword);
    });

    function createController(id) {
      return $controllerConstructor('passwordEditorController', {
        $modalInstance: mockModalInstance,
        notifier: mockNotifier,
        UserPassword: mockUserPasswordConstructor,
        userId: id
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activation', function() {
      it('creates a new UserPassword resource', function() {
        createController();
        expect(mockUserPasswordConstructor.calledOnce).to.be.true;
      });

      it('creates the UserPassword resource with the user ID', function() {
        createController(73);
        expect(mockUserPasswordConstructor.calledWith({_id: 73})).to.be.true;
      });
    });

    describe('saving a password change', function() {
      it('updates the user password', function() {
        var controller = createController(42);
        controller.save();
        expect(mockUserPassword.$update.calledOnce).to.be.true;
      });

      describe('on success', function() {
        it('notifies the user', function() {
          var controller = createController();
          controller.save();
          mockUserPassword.$update.yield();
          expect(mockNotifier.notify.calledOnce).to.be.true;
        });

        it('closes the dialog', function() {
          var controller = createController();
          controller.save();
          mockUserPassword.$update.yield();
          expect(mockModalInstance.close.calledOnce).to.be.true;
        });
      });

      describe('on failure', function() {
        it('notifies the user', function() {
          var controller = createController();
          controller.save();
          mockUserPassword.$update.callArgWith(1, {
            data: {
              reason: 'Because you suck eggs'
            }
          });
          expect(mockNotifier.error.calledOnce).to.be.true;
          expect(mockNotifier.error.calledWith('Because you suck eggs')).to.be.true;
        });

        it('sets an error message in the editor dialog', function() {
          var controller = createController();
          controller.save();
          mockUserPassword.$update.callArgWith(1, {
            data: {
              reason: 'Because you suck eggs'
            }
          });
          expect(controller.errorMessage).to.equal('Because you suck eggs');
        });
      });
    });
  });
}());