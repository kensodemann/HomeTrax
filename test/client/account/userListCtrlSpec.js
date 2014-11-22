'use strict';

describe('userListCtrl', function() {
  var scope;
  var $controllerConstructor;
  var q;

  var mockModal;
  var mockModalConstructor;
  var mockNotifier;
  var mockUser;
  var mockUserConstructor;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
    q = $q;
  }));

  beforeEach(function() {
    buildMockModal();
    buildMockNotifier();
    buildMockUser();
  });

  function buildMockModal() {
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
  }

  function buildMockNotifier() {
    mockNotifier = sinon.stub({
      notify: function() {
      },
      error: function() {
      }
    });
  }

  function buildMockUser() {
    mockUser = sinon.stub({
      $save: function() {
      },
      $update: function() {
      }
    });
    mockUserConstructor = sinon.stub().returns(mockUser);
    mockUserConstructor.query = sinon.stub();
  }

  function createController() {
    $controllerConstructor('userListCtrl', {
      $scope: scope,
      User: mockUserConstructor,
      $modal: mockModalConstructor,
      notifier: mockNotifier
    });
  }

  describe('Initialization', function() {
    it('calls the user service to get a list of users', function() {
      createController();
      expect(mockUserConstructor.query.called).to.be.true;
    });
  });

  describe('Editing Existing User', function() {
    var editDialog;
    beforeEach(function() {
      createController();
      editDialog = mockModalConstructor.getCall(0).args[0].scope;
    });

    it('copies the user to the editor model', function() {
      var user = {
        firstName: 'Bob',
        lastName: 'Johnson',
        username: 'bojo@email.com'
      };
      scope.edit(user);

      expect(editDialog.model.firstName).to.equal('Bob');
      expect(editDialog.model.lastName).to.equal('Johnson');
      expect(editDialog.model.username).to.equal('bojo@email.com');
      expect(editDialog.model).to.not.equal(user);
    });

    it('sets the mode to edit', function() {
      scope.edit({});
      expect(editDialog.mode).to.equal('edit');
    });

    it('sets the title to Edit User', function() {
      scope.edit({});
      expect(editDialog.title).to.equal('Edit User');
    });

    it('sets te button label to Save Changes', function() {
      scope.edit({});
      expect(editDialog.saveLabel).to.equal('Save Changes');
    });

    it('opens the modal dialog', function() {
      scope.edit({});
      mockModal.$promise.then.yield();
      expect(mockModal.show.calledOnce).to.be.true;
    });
  });

  describe('Creating New User', function() {
    var editDialog;
    beforeEach(function() {
      createController();
      editDialog = mockModalConstructor.getCall(0).args[0].scope;
    });

    it('sets the mode to edit', function() {
      scope.create();
      expect(editDialog.mode).to.equal('create');
    });

    it('sets the title to Create User', function() {
      scope.create();
      expect(editDialog.title).to.equal('Create User');
    });

    it('sets te button label to Create', function() {
      scope.create();
      expect(editDialog.saveLabel).to.equal('Create');
    });

    it('opens the modal dialog', function() {
      scope.create();
      mockModal.$promise.then.yield();
      expect(mockModal.show.calledOnce).to.be.true;
    });
  });

  describe('save user', function() {
    describe('creating new user', function() {
      var editDialog;
      beforeEach(function() {
        createController();
        scope.create();
        editDialog = mockModalConstructor.getCall(0).args[0].scope;
      });

      it('copies the data to the user resource', function() {
        editDialog.model.firstName = 'Bob';
        editDialog.model.lastName = 'Fredricks';
        editDialog.model.username = 'email@me.com';
        editDialog.model.password = 'jimmy johns';
        editDialog.save();
        expect(mockUser.firstName).to.equal('Bob');
        expect(mockUser.lastName).to.equal('Fredricks');
        expect(mockUser.username).to.equal('email@me.com');
        expect(mockUser.password).to.equal('jimmy johns');
      });

      it('saves the user', function() {
        editDialog.save();
        expect(mockUser.$save.calledOnce).to.be.true;
      });

      it('notifies the user upon success', function() {
        editDialog.save();
        mockUser.$save.callArg(0);
        expect(mockNotifier.notify.calledOnce).to.be.true;
        expect(mockNotifier.notify.calledWith('User Created Successfully')).to.be.true;
      });

      it('closes the dialog upon success', function() {
        editDialog.save();
        mockUser.$save.callArg(0);
        expect(mockModal.hide.calledOnce).to.be.true;
      });

      it('notifies the user upon failure', function() {
        editDialog.save();
        mockUser.$save.callArgWith(1, {data: 'You are a sucky sucky failure'});
        expect(mockNotifier.error.calledOnce).to.be.true;
        expect(mockNotifier.error.calledWith('You are a sucky sucky failure')).to.be.true;
      });

      it('does not close the dialog upon failure', function() {
        editDialog.save();
        mockUser.$save.callArgWith(1, {data: 'You are a sucky sucky failure'});
        expect(mockModal.hide.called).to.be.false;
      });
    });

    describe('editing existing user', function() {
      var editDialog;
      beforeEach(function() {
        createController();
        scope.edit(mockUser);
        editDialog = mockModalConstructor.getCall(0).args[0].scope;
      });

      it('copies the data to the user resource', function() {
        editDialog.model.firstName = 'Bob';
        editDialog.model.lastName = 'Fredricks';
        editDialog.model.username = 'email@me.com';
        editDialog.model.password = 'jimmy johns';
        editDialog.save();
        expect(mockUser.firstName).to.equal('Bob');
        expect(mockUser.lastName).to.equal('Fredricks');
        expect(mockUser.username).to.equal('email@me.com');
        expect(mockUser.password).to.be.undefined;
      });

      it('saves the user', function() {
        editDialog.save();
        expect(mockUser.$update.calledOnce).to.be.true;
      });

      it('notifies the user upon success', function() {
        editDialog.save();
        mockUser.$update.callArg(0);
        expect(mockNotifier.notify.calledOnce).to.be.true;
        expect(mockNotifier.notify.calledWith('User Saved Successfully')).to.be.true;
      });

      it('closes the dialog upon success', function() {
        editDialog.save();
        mockUser.$update.callArg(0);
        expect(mockModal.hide.calledOnce).to.be.true;
      });

      it('notifies the user upon failure', function() {
        editDialog.save();
        mockUser.$update.callArgWith(1, {data: 'You are a sucky sucky failure'});
        expect(mockNotifier.error.calledOnce).to.be.true;
        expect(mockNotifier.error.calledWith('You are a sucky sucky failure')).to.be.true;
      });

      it('does not close the dialog upon failure', function() {
        editDialog.save();
        mockUser.$update.callArgWith(1, {data: 'You are a sucky sucky failure'});
        expect(mockModal.hide.called).to.be.false;
      });
    });
  });
});