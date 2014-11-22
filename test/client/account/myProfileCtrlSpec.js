'use strict';

describe('myProfileCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var mockIdentiy;
  var mockModal;
  var mockModalConstructor;
  var mockNotifier;
  var mockUserResource;
  var mockUser;
  var mockUserPassword;
  var mockUserPasswordResource;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;

    createMocks();
    createController();
  }));

  function createMocks() {
    mockIdentiy = sinon.stub({
      currentUser: {
        _id: '123456789009876543211234'
      }
    });

    var mockPromise = sinon.stub({
      then: function() {
      }
    });

    mockModal = sinon.stub({
      $promise: mockPromise,
      show: function() {
      },
      hide: function() {
      }
    });
    mockModalConstructor = sinon.stub().returns(mockModal);

    mockNotifier = sinon.stub({
      notify: function() {
      },
      error: function() {
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

    mockUserPassword = sinon.stub({
      $update: function() {
      }
    });
    mockUserPasswordResource = sinon.stub().returns(mockUserPassword);
  }

  function createController() {
    return $controllerConstructor('myProfileCtrl', {
      $scope: scope,
      User: mockUserResource,
      UserPassword: mockUserPasswordResource,
      identity: mockIdentiy,
      notifier: mockNotifier,
      $modal: mockModalConstructor
    });
  }

  describe('Initialization', function() {
    it('Gets the currently logged in user', function() {
      expect(mockUserResource.get.calledOnce).to.be.true;
      expect(mockUserResource.get.calledWith({
        id: '123456789009876543211234'
      })).to.be.true;
      expect(scope.user).to.equal(mockUser);
    });
  });

  describe('Reset', function() {
    it('Gets the data for the currently logged in user', function() {
      scope.user = undefined;

      scope.reset();

      expect(mockUserResource.get.calledTwice).to.be.true;
      expect(mockUserResource.get.calledWith({
        id: '123456789009876543211234'
      })).to.be.true;
      expect(scope.user).to.equal(mockUser);
    });
  });

  describe('Save', function() {
    it('updates the data', function() {
      scope.save();
      expect(mockUser.$update.calledOnce).to.be.true;
    });
  });

  describe('Changing the password', function() {
    it('sets the password model in the $scope', function() {
      scope.getNewPassword();
      expect(scope.passwordModel).to.not.be.undefined;
      expect(scope.passwordModel).to.equal(mockUserPassword);
    });

    it('initializes the _id to the _id of the user', function() {
      scope.getNewPassword();
      expect(scope.passwordModel._id).to.equal('123456789009876543211234');
    });

    it('opens the modal dialog', function() {
      scope.getNewPassword();
      mockModal.$promise.then.yield();
      expect(mockModal.show.calledOnce).to.be.true;
    });

    describe('setting new password', function() {
      beforeEach(function() {
        scope.getNewPassword();
      });

      it('updates password', function() {
        createController();
        scope.setPassword();

        expect(scope.passwordModel.$update.calledOnce).to.be.true;
      });

      it('notifies user on password change success', function() {
        scope.setPassword();
        resolvePasswordUpdate();

        expect(mockNotifier.notify.calledOnce).to.be.true;
        expect(mockNotifier.notify.calledWith('Password changed successfully')).to.be.true;
      });

      it('closes the modal if http request successful', function() {
        scope.setPassword();
        resolvePasswordUpdate();

        expect(mockModal.hide.calledOnce).to.be.true;
      });

      it('notifies user if http request fails', function() {
        scope.setPassword();
        rejectPasswordUpdate();

        expect(scope.errorMessage).to.equal('because you suck eggs');
        expect(mockNotifier.error.calledOnce).to.be.true;
        expect(mockNotifier.error.calledWith('because you suck eggs')).to.be.true;
        expect(mockModal.hide.called).to.be.false;
      });

      function resolvePasswordUpdate() {
        scope.passwordModel.$update.callArgWith(0, scope.passwordModel);
      }

      function rejectPasswordUpdate() {
        scope.passwordModel.$update.callArgWith(1, {
          status: 400,
          statusText: 'something went wrong',
          data: {
            reason: 'because you suck eggs'
          }
        });
      }
    });
  });
});