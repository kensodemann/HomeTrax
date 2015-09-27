/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('myProfileCtrl', function() {
    beforeEach(module('homeTrax.userAdministration'));

    var controller;
    var $controllerConstructor;
    var mockColors;
    var mockIdentity;
    var mockNotifier;
    var mockPasswordEditor;
    var mockUserResource;
    var mockUser;

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;

      createMocks();
      createController();
    }));

    function createMocks() {
      buildMockColors();
      buildMockIdentity();
      buildMockNotifier();
      buildMockPasswordEditor();
      buildMockUser();

      function buildMockColors() {
        mockColors = {
          eventColors: [1, 2, 3],
          userColors: [4, 5, 6]
        };
      }

      function buildMockIdentity() {
        mockIdentity = sinon.stub({
          currentUser: {
            _id: '123456789009876543211234'
          }
        });
      }

      function buildMockNotifier() {
        mockNotifier = sinon.stub({
          error: function() {},

          notify: function() {}
        });
      }

      function buildMockPasswordEditor() {
        mockPasswordEditor = sinon.stub({
          open: function() {}
        });
      }

      function buildMockUser() {
        mockUser = sinon.stub({
          $update: function() {}
        });

        mockUserResource = sinon.stub({
          get: function() {}
        });
        mockUserResource.get.returns(mockUser);
      }
    }

    function createController() {
      controller = $controllerConstructor('myProfileController', {
        User: mockUserResource,
        identity: mockIdentity,
        passwordEditor: mockPasswordEditor,
        notifier: mockNotifier,
        colors: mockColors
      });
    }

    describe('Initialization', function() {
      it('Gets the currently logged in user', function() {
        expect(mockUserResource.get.calledOnce).to.be.true;
        expect(mockUserResource.get.calledWith({
          id: '123456789009876543211234'
        })).to.be.true;
        expect(controller.model).to.equal(mockUser);
      });
    });

    describe('Reset', function() {
      it('Gets the data for the currently logged in user', function() {
        controller.model = undefined;

        controller.reset();

        expect(mockUserResource.get.calledTwice).to.be.true;
        expect(mockUserResource.get.calledWith({
          id: '123456789009876543211234'
        })).to.be.true;
        expect(controller.model).to.equal(mockUser);
      });
    });

    describe('Save', function() {
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
        expect(mockPasswordEditor.open.calledOnce).to.be.true;
        expect(mockPasswordEditor.open.calledWithExactly('123456789009876543211234')).to.be.true;
      });
    });
  });
}());