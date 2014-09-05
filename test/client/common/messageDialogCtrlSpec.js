'use strict';

describe('messageDialogCtrl', function (){
  var scope;
  var $controllerConstructor;
  var mockModalInstance;

  beforeEach(module('app'));

  beforeEach(inject(function ($controller, $rootScope){
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  beforeEach(function (){
    mockModalInstance = sinon.stub({
      dismiss: function (){
      },
      close: function (){
      }
    });
  });

  it('exists', function (){
    var ctrl = $controllerConstructor('messageDialogCtrl', {
      $scope: scope,
      $modalInstance: mockModalInstance,
      messageModel: {}
    });
    expect(ctrl).to.not.be.undefined;
  });

  describe('instantiation', function (){
    it('sets the title', function (){
      $controllerConstructor('messageDialogCtrl', {
        $scope: scope,
        $modalInstance: mockModalInstance,
        messageModel: {title: 'Pope of Peas', message: 'I have a message for you'}
      });
      expect(scope.title).to.equal('Pope of Peas');
    });

    it('sets the message', function (){
      $controllerConstructor('messageDialogCtrl', {
        $scope: scope,
        $modalInstance: mockModalInstance,
        messageModel: {title: 'Pope of Peas', message: 'I have a message for you'}
      });
      expect(scope.message).to.equal('I have a message for you');
    });
  });

  describe('dismiss', function (){
    it('dismisses the modal dialog', function (){
      $controllerConstructor('messageDialogCtrl', {
        $scope: scope,
        $modalInstance: mockModalInstance,
        messageModel: {}
      });
      scope.dismiss();

      expect(mockModalInstance.dismiss.calledOnce).to.be.true;
    });
  });

  describe('yes', function (){
    it('closes the modal dialog with a true flag', function (){
      $controllerConstructor('messageDialogCtrl', {
        $scope: scope,
        $modalInstance: mockModalInstance,
        messageModel: {}
      });
      scope.yes();

      expect(mockModalInstance.close.calledOnce).to.be.true;
      expect(mockModalInstance.close.calledWith(true)).to.be.true;
    });
  })
});