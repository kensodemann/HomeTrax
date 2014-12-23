(function() {
  'use strict';

  describe('myProfileCtrl', function() {
    beforeEach(module('app.account'));

    var ctrl;
    var $controllerConstructor;
    var mockIdentity;
    var mockPasswordEditor;
    var mockUserResource;
    var mockUser;

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;

      createMocks();
      createController();
    }));

    function createMocks() {
      mockIdentity = sinon.stub({
        currentUser: {
          _id: '123456789009876543211234'
        }
      });

      mockPasswordEditor = sinon.stub({
        open: function() {
        }
      });

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

    function createController() {
      ctrl = $controllerConstructor('myProfileCtrl', {
        User: mockUserResource,
        identity: mockIdentity,
        passwordEditor: mockPasswordEditor
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

    // describe('Reset', function() {
    //   it('Gets the data for the currently logged in user', function() {
    //     ctrl.user = undefined;

    //     ctrl.reset();

    //     expect(mockUserResource.get.calledTwice).to.be.true;
    //     expect(mockUserResource.get.calledWith({
    //       id: '123456789009876543211234'
    //     })).to.be.true;
    //     expect(ctrl.user).to.equal(mockUser);
    //   });
    // });

    describe('Save', function() {
      it('updates the data', function() {
        ctrl.save();
        expect(mockUser.$update.calledOnce).to.be.true;
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
      })
    })
  });
}());