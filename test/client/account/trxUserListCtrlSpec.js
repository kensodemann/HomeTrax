'use strict'

describe('trxUserListCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));


  describe('users', function() {
    var mockUser;

    beforeEach(function() {
      mockUser = sinon.stub({
        query: function() {}
      });
    });

    it('calls the user service to get a list of users', function() {
      var ctrl = $controllerConstructor('trxUserListCtrl', {
        $scope: scope,
        trxUser: mockUser
      });
      scope.users();

      expect(mockUser.query.called).to.be.true;
    });
  });

})