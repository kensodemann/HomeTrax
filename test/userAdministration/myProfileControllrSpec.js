(function() {
  'use strict';

  describe('myProfileCtrl', function() {
    beforeEach(module('homeTrax.userAdministration'));

    var controller;
    var $controllerConstructor;
    var mockIdentity;
    var mockNotifier;
    var mockPasswordEditor;
    var mockUserResource;
    var mockUser;

    var identityGetDfd;
    var scope;

    beforeEach(inject(function($controller, $rootScope, $q) {
      $controllerConstructor = $controller;
      scope = $rootScope.$new();
      identityGetDfd = $q.defer();

      createMocks();
      createController();
    }));

    function createMocks() {
      buildMockIdentity();
      buildMockNotifier();
      buildMockPasswordEditor();
      buildMockUser();

      function buildMockIdentity() {
        mockIdentity = sinon.stub({
          get: function() {
          }
        });
        mockIdentity.get.returns(identityGetDfd.promise);
      }

      function buildMockNotifier() {
        mockNotifier = sinon.stub({
          error: function() {
          },

          notify: function() {
          }
        });
      }

      function buildMockPasswordEditor() {
        mockPasswordEditor = sinon.stub({
          open: function() {
          }
        });
      }

      function buildMockUser() {
        mockUser = sinon.stub({
          $update: function() {
          }
        });

        mockUserResource = sinon.stub({
          get: function() {
          }
        });
        mockUserResource.get.returns(mockUser);
      }
    }

    function createController() {
      controller = $controllerConstructor('myProfileController', {
        User: mockUserResource,
        identity: mockIdentity,
        passwordEditor: mockPasswordEditor,
        notifier: mockNotifier
      });
    }

    describe('Initialization', function() {
      it('Gets the current identity', function() {
        expect(mockIdentity.get.calledOnce).to.be.true;
      });

      it('Gets the user resource after the identity is known', function() {
        expect(mockUserResource.get.called).to.be.false;
        identityGetDfd.resolve({_id: 1234});
        scope.$digest();
        expect(mockUserResource.get.calledOnce).to.be.true;
        expect(mockUserResource.get.calledWith({id: 1234})).to.be.true;
      });
    });

    describe('Reset', function() {
      beforeEach(function() {
        identityGetDfd.resolve({_id: 4313});
        scope.$digest();
      });

      it('Gets the data for the currently logged in user', function() {
        controller.model = undefined;

        controller.reset();
        identityGetDfd.resolve({_id: 1234});
        scope.$digest();

        expect(mockUserResource.get.calledTwice).to.be.true;
        expect(controller.model).to.equal(mockUser);
      });
    });

    describe('Save', function() {
      beforeEach(function() {
        identityGetDfd.resolve({_id: 4313});
        scope.$digest();
      });

      it('updates the data', function() {
        controller.save();
        expect(mockUser.$update.calledOnce).to.be.true;
      });

      it('notifies the user upon success', function() {
        controller.save();
        mockUser.$update.callArg(0);
        expect(mockNotifier.notify.calledOnce).to.be.true;
        expect(mockNotifier.notify.calledWith('Profile modifications saved successfully'));
      });

      it('notifies the user upon error', function() {
        controller.save();
        mockUser.$update.callArgWith(1, {
          status: 400,
          statusText: 'something went wrong',
          data: {
            reason: 'because you suck eggs'
          }
        });
        expect(mockNotifier.error.calledOnce).to.be.true;
        expect(mockNotifier.error.calledWith('because you suck eggs')).to.be.true;
      });
    });

    describe('Changing Password', function() {
      it('opens the password editor', function() {
        controller.openPasswordEditor();
        identityGetDfd.resolve({_id: 4313});
        scope.$digest();
        expect(mockPasswordEditor.open.calledOnce).to.be.true;
        expect(mockPasswordEditor.open.calledWithExactly(4313)).to.be.true;
      });
    });
  });
}());