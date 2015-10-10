(function() {
  'use strict';

  describe('homeTrax.userAdministration: userEditorController', function() {
    var mockModalInstance;
    var mockNotifier;
    var $controllerConstructor;

    var EditorMode;

    beforeEach(module('homeTrax.userAdministration'));

    beforeEach(inject(function($controller, _EditorMode_) {
      EditorMode = _EditorMode_;
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

    function createController(user, mode) {
      return $controllerConstructor('userEditorController', {
        $modalInstance: mockModalInstance,
        notifier: mockNotifier,
        user: user || {
          isAdministrator: sinon.stub()
        },
        mode: mode
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activation', function() {
      var testUser;
      beforeEach(function() {
        testUser = {
          firstName: 'Billy',
          lastName: 'Peachtree',
          username: 'bp@email.com',
          isAdministrator: sinon.stub()
        };
      });

      it('sets the first name', function() {
        var controller = createController(testUser);
        expect(controller.firstName).to.equal('Billy');
      });

      it('sets the last name', function() {
        var controller = createController(testUser);
        expect(controller.lastName).to.equal('Peachtree');
      });

      it('sets the username', function() {
        var controller = createController(testUser);
        expect(controller.username).to.equal('bp@email.com');
      });

      it('sets is admin true if the user is an admin', function() {
        testUser.isAdministrator.returns(true);
        var controller = createController(testUser);
        expect(controller.isAdministrator).to.be.true;
      });

      it('sets is admin false if the user is not an admin', function() {
        testUser.isAdministrator.returns(false);
        var controller = createController(testUser);
        expect(controller.isAdministrator).to.be.false;
      });

      it('sets the title if in create mode', function() {
        var controller = createController(testUser, EditorMode.create);
        expect(controller.title).to.equal('Create User');
      });

      it('sets the title if in edit mode', function() {
        var controller = createController(testUser, EditorMode.edit);
        expect(controller.title).to.equal('Edit User');
      });
    });

    describe('saving a user', function() {
      var testUser;
      beforeEach(function() {
        testUser = {
          firstName: 'Billy',
          lastName: 'Peachtree',
          username: 'bp@email.com',
          isAdministrator: sinon.stub(),
          $save: sinon.stub()
        };
        testUser.isAdministrator.returns(false);
      });

      it('saves the user', function() {
        var controller = createController(testUser);
        controller.save();
        expect(testUser.$save.calledOnce).to.be.true;
      });

      describe('on success', function() {
        it('closes the editor', function() {
          var controller = createController(testUser);
          controller.save();
          testUser.$save.yield();
          expect(mockModalInstance.close.calledOnce).to.be.true;
        });

        it('passes the user on close', function() {
          var controller = createController(testUser);
          controller.save();
          testUser.$save.yield();
          expect(mockModalInstance.close.calledWith(testUser)).to.be.true;
        });

        it('notifies the user with an appropriate message for create', function() {
          var controller = createController(testUser, EditorMode.create);
          controller.save();
          testUser.$save.yield();
          expect(mockNotifier.notify.calledOnce).to.be.true;
          expect(mockNotifier.notify.calledWith('User created successfully')).to.be.true;
        });

        it('notifies the user with an appropriate message for update', function() {
          var controller = createController(testUser, EditorMode.edit);
          controller.save();
          testUser.$save.yield();
          expect(mockNotifier.notify.calledOnce).to.be.true;
          expect(mockNotifier.notify.calledWith('Changes to user saved successfully')).to.be.true;
        });
      });

      describe('on failure', function() {
        it('does not close the editor', function() {
          var controller = createController(testUser);
          controller.save();
          testUser.$save.callArgWith(1, {
            data: {
              reason: 'Because you suck eggs'
            }
          });
          expect(mockModalInstance.close.called).to.be.false;
        });

        it('notifies the user of the failure', function() {
          var controller = createController(testUser);
          controller.save();
          testUser.$save.callArgWith(1, {
            data: {
              reason: 'Because you suck eggs'
            }
          });
          expect(mockNotifier.error.calledOnce).to.be.true;
          expect(mockNotifier.error.calledWith('Because you suck eggs')).to.be.true;
        });

        it('sets the error message', function() {
          var controller = createController(testUser);
          controller.save();
          testUser.$save.callArgWith(1, {
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