/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('myProfileCtrl', function() {
    beforeEach(module('app.account'));

    var ctrl;
    var $controllerConstructor;
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
      buildMockIdentity();
      buildMockNotifier();
      buildMockPasswordEditor();
      buildMockUser();

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
      ctrl = $controllerConstructor('myProfileCtrl', {
        User: mockUserResource,
        identity: mockIdentity,
        passwordEditor: mockPasswordEditor,
        notifier: mockNotifier
      });
    }

    describe('Initialization', function() {
      it('Gets the currently logged in user', function() {
        expect(mockUserResource.get.calledOnce).to.be.true;
        expect(mockUserResource.get.calledWith({
          id: '123456789009876543211234'
        })).to.be.true;
        expect(ctrl.user).to.equal(mockUser);
      });
    });

    describe('Reset', function() {
      it('Gets the data for the currently logged in user', function() {
        ctrl.user = undefined;

        ctrl.reset();

        expect(mockUserResource.get.calledTwice).to.be.true;
        expect(mockUserResource.get.calledWith({
          id: '123456789009876543211234'
        })).to.be.true;
        expect(ctrl.user).to.equal(mockUser);
      });
    });

    describe('Save', function() {
      it('updates the data', function() {
        ctrl.save();
        expect(mockUser.$update.calledOnce).to.be.true;
      });

      it('notifies the user upon success', function() {
        ctrl.save();
        mockUser.$update.callArg(0);
        expect(mockNotifier.notify.calledOnce).to.be.true;
        expect(mockNotifier.notify.calledWith('Profile modifications saved successfully'));
      });

      it('notifies the user upon error', function() {
        ctrl.save();
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
        ctrl.openPasswordEditor();
        expect(mockPasswordEditor.open.calledOnce).to.be.true;
        expect(mockPasswordEditor.open.calledWithExactly('123456789009876543211234')).to.be.true;
      });
    });

    describe('Color Style', function() {
      it('sets the background color to the specified color', function() {
        var style = ctrl.backgroundColor("#ffef12");
        expect(style).to.deep.equal({
          'background-color': '#ffef12'
        });
      });
    });
  });
}());