'use strict'

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
        lastName: 'Flintstone'
      };
    });

    it('sets the model', function() {
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.model).to.deep.equal(model);
    });

    it('sets the title to edit if model has _id', function() {
      model._id = 1;
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.title).to.equal('Edit User');
    });

    it('sets the title to create if model does not have an _id', function() {
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.title).to.equal('Create New User');
    });

    it('sets the title to create if model _id is null', function() {
      model._id = null;
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.title).to.equal('Create New User');
    });

    it('sets the mode to edit if model has _id', function() {
      model._id = 1;
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.mode).to.equal('edit');
    });

    it('sets the mode to create if model does not have an _id', function() {
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.mode).to.equal('create');
    });

    it('sets the mode to create if model _id is null', function() {
      model._id = null;
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.mode).to.equal('create');
    });

    it('sets passwordIsValid to true if model has _id', function() {
      model._id = 1;
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.passwordIsValid).to.be.true;
    });

    it('sets passwordIsValid to false if model does not have an _id', function() {
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.passwordIsValid).to.be.false;
    });

    it('sets passwordIsValid to false if model _id is null', function() {
      model._id = null;
      var ctrl = $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });

      expect(scope.passwordIsValid).to.be.false;
    });
  });

  describe('password validation', function() {
    function createController(model) {
      return $controllerConstructor('userEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        userModel: model
      });
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
      var ctrl = $controllerConstructor('userEditorCtrl', {
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
      var ctrl = createController(mockModel);
      scope.ok();

      expect(mockModel.$save.calledOnce).to.be.true;
      expect(mockModel.$update.called).to.be.false;
    });

    it('updates existing user', function() {
      mockModel._id = 1;
      var ctrl = createController(mockModel);
      scope.ok();

      expect(mockModel.$save.called).to.be.false;
      expect(mockModel.$update.calledOnce).to.be.true;
    });

    it('closes the modal if http request successful', function() {
      var ctrl = createController(mockModel);
      scope.ok();
      mockModel.$save.callArgWith(0, mockModel);

      expect(mockModalInstance.close.calledOnce).to.be.true;
      expect(mockModalInstance.close.calledWith(mockModel)).to.be.true;
    });

    it('notifies user if http request fails', function() {
      var ctrl = createController(mockModel);
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