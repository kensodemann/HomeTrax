'use strict';

describe('passwordEditorCtrl', function() {
  var scope;
  var $controllerConstructor;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  it('exists', function() {
    var ctrl = $controllerConstructor('passwordEditorCtrl', {
      $scope: scope,
      $modalInstance: {},
      passwordModel: {}
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

    function createController(model) {
      return $controllerConstructor('passwordEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        passwordModel: model
      });
    }

    it('sets the model', function() {
      createController(model);
      expect(scope.model).to.deep.equal(model);
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
      $controllerConstructor('passwordEditorCtrl', {
        $scope: scope,
        $modalInstance: mockModalInstance,
        passwordModel: {}
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
        $update: function() {}
      });
    });

    function createController(model) {
      return $controllerConstructor('passwordEditorCtrl', {
        $scope: scope,
        $modalInstance: mockModalInstance,
        passwordModel: model
      });
    }

    it('updates password', function() {
      createController(mockModel);
      scope.ok();

      expect(mockModel.$update.calledOnce).to.be.true;
    });

    it('closes the modal if http request successful', function() {
      createController(mockModel);
      scope.ok();
      mockModel.$update.callArgWith(0, mockModel);

      expect(mockModalInstance.close.calledOnce).to.be.true;
    });

    it('notifies user if http request fails', function() {
      createController(mockModel);
      scope.ok();
      mockModel.$update.callArgWith(1, {
        status: 400,
        statusText: 'something went wrong',
        data: {
          reason: 'because you suck eggs'
        }
      });

      expect(scope.errorMessage).to.equal('because you suck eggs');
      expect(mockModalInstance.close.called).to.be.false;
    });
  });
});