'use strict';

describe('userEditorCtrl', function() {
  var scope;
  var $controllerConstructor;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  it('exists', function() {
    var ctrl = $controllerConstructor('userEditorCtrl', {
      $scope: scope,
      $modalInstance: {},
      userModel: {}
    });

    expect(ctrl).to.not.be.undefined;
  });

  describe('instantiation', function() {
    var model;

    beforeEach(function() {
      model = {
        firstName: 'Fred',
        lastName: 'Flintstone',
        username: 'wilmas_man@stoneage.net'
      };
    });

    it('sets the data model', function() {
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.model.firstName).to.equal('Fred');
      expect(scope.model.lastName).to.equal('Flintstone');
      expect(scope.model.username).to.equal('wilmas_man@stoneage.net');
      expect(scope.model).to.not.equal(model);
    });

    it('sets the title to edit if model has _id', function() {
      model._id = 1;
     $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.title).to.equal('Edit User');
    });

    it('sets the title to create if model does not have an _id', function() {
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.title).to.equal('Create New User');
    });

    it('sets the title to create if model _id is null', function() {
      model._id = null;
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.title).to.equal('Create New User');
    });

    it('sets the mode to edit if model has _id', function() {
      model._id = 1;
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.mode).to.equal('edit');
    });

    it('sets the mode to create if model does not have an _id', function() {
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.mode).to.equal('create');
    });

    it('sets the mode to create if model _id is null', function() {
      model._id = null;
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.mode).to.equal('create');
    });

    it('sets passwordIsValid to true if model has _id', function() {
      model._id = 1;
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.passwordIsValid).to.be.true;
    });

    it('sets passwordIsValid to false if model does not have an _id', function() {
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.passwordIsValid).to.be.false;
    });

    it('sets passwordIsValid to false if model _id is null', function() {
      model._id = null;
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.passwordIsValid).to.be.false;
    });
  });

  describe('password validation', function() {
    function createController(model) {
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });
      scope.model.password = model.password;
      scope.model.verifyPassword = model.verifyPassword;

      return ctrl;
    }

    it('sets password invalid if it is too short', function() {
      createController({
        password: 'xsevenx',
        verifyPassword: 'xsevenx'
      });
      scope.validatePassword();

      expect(scope.errorMessage).to.equal('New password must be at least 8 characters long');
      expect(scope.passwordIsValid).to.be.false;
    });

    it('sets password invalid if passwords do not match', function() {
      createController({
        password: 'xeightxx',
        verifyPassword: 'xeightx'
      });
      scope.validatePassword();

      expect(scope.errorMessage).to.equal('Passwords do not match');
      expect(scope.passwordIsValid).to.be.false;
    });

    it('sets password valid if it long enough and matches', function() {
      createController({
        password: 'xeightxx',
        verifyPassword: 'xeightxx'
      });
      scope.validatePassword();

      expect(scope.errorMessage).to.equal('');
      expect(scope.passwordIsValid).to.be.true;
    });
  });

  describe('cancel', function() {
    var mockModalInstance;

    beforeEach(function() {
      mockModalInstance = sinon.stub({
        dismiss: function() {}
      });
    });

    it('should dismiss the modal', function() {
      $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: mockModalInstance,
        userModel: {}
      });
      scope.cancel();

      expect(mockModalInstance.dismiss.calledOnce).to.be.true;
    });
  });

  describe('ok', function() {
    var mockModalInstance;
    var mockModel;

    beforeEach(function() {
      mockModalInstance = sinon.stub({
        dismiss: function() {},
        close: function() {}
      });
      mockModel = sinon.stub({
        $save: function() {},
        $update: function() {}
      });
    });

    function createController(model) {
      return $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: mockModalInstance,
        userModel: model
      });
    }

    it('saves new user', function() {
      createController(mockModel);
      scope.ok();

      expect(mockModel.$save.calledOnce).to.be.true;
      expect(mockModel.$update.called).to.be.false;
    });

    it('updates existing user', function() {
      mockModel._id = 1;
      createController(mockModel);
      scope.ok();

      expect(mockModel.$save.called).to.be.false;
      expect(mockModel.$update.calledOnce).to.be.true;
    });

    it('copies editor model data to data model for new user', function() {
      createController(mockModel);
      scope.model.firstName = 'Barney';
      scope.model.lastName = 'Rubble';
      scope.model.username = 'wilmas_secret_lover@hotmail.com';
      scope.model.password = 'Fr$dCann0tKnow';

      scope.ok();

      expect(mockModel.firstName).to.equal('Barney');
      expect(mockModel.lastName).to.equal('Rubble');
      expect(mockModel.username).to.equal('wilmas_secret_lover@hotmail.com');
      expect(mockModel.password).to.equal('Fr$dCann0tKnow');
    });

    it('copies editor model data to data model for existing user', function() {
      mockModel._id = 1;
      mockModel.firstName = 'Barney';
      mockModel.lastName = 'Rubble';
      mockModel.username = 'wilmas_secret_lover@hotmail.com';
      createController(mockModel);
      scope.model.firstName = 'Betty';
      scope.model.lastName = 'Boop';
      scope.model.username = 'wilmas_other_secret_lover@hotmail.com';

      scope.ok();

      expect(mockModel.firstName).to.equal('Betty');
      expect(mockModel.lastName).to.equal('Boop');
      expect(mockModel.username).to.equal('wilmas_other_secret_lover@hotmail.com');
    });

    it('closes the modal if http request successful', function() {
      createController(mockModel);
      scope.ok();
      mockModel.$save.callArgWith(0, mockModel);

      expect(mockModalInstance.close.calledOnce).to.be.true;
      expect(mockModalInstance.close.calledWith(mockModel)).to.be.true;
    });

    it('notifies user if http request fails', function() {
      createController(mockModel);
      scope.ok();
      mockModel.$save.callArgWith(1, {
        status: 400,
        statusText: 'something went wrong',
        data: {
          reason: 'flying monkey butts'
        }
      });

      expect(scope.errorMessage).to.equal('flying monkey butts');
      expect(mockModalInstance.close.called).to.be.false;
    });
  });
});