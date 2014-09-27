'use strict'

describe('userListCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var q;

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
    q = $q;
  }));


  describe('Initialization', function() {
    var mockUser;

    beforeEach(function() {
      mockUser = sinon.stub({
        query: function() {}
      });
    });

    it('calls the user service to get a list of users', function() {
      var ctrl = $controllerConstructor('userListCtrl', {
        $scope: scope,
        User: mockUser,
        $modal: {}
      });
      var users = scope.users;

      expect(mockUser.query.called).to.be.true;
    });
  });

  describe('Editing Existing User', function() {
    var mockModal;
    var mockUser;

    beforeEach(function() {
      mockUser = sinon.stub({
        query: function() {},
      });
      mockModal = sinon.stub({
        open: function() {}
      });
      createController();
    });

    function createController() {
      $controllerConstructor('userListCtrl', {
        $scope: scope,
        User: mockUser,
        $modal: mockModal
      });
    }

    it('opens the modal dialog', function() {
      scope.edit({});
      expect(mockModal.open.calledOnce).to.be.true;
      expect(mockModal.open.getCall(0).args[0].controller).to.equal('userEditorCtrl');
      expect(mockModal.open.getCall(0).args[0].templateUrl).to.equal('/partials/account/userEditor');
    });

    it('injects the specified model into the controller', function() {
      scope.edit({
        userName: 'fredflintstone@gmail.com'
      });
      expect(mockModal.open.getCall(0).args[0].resolve.userModel()).to.deep.equal({
        userName: 'fredflintstone@gmail.com'
      });
    });
  });
})