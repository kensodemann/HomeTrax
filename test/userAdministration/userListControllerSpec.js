(function() {
  'use strict';

  describe('homeTrax.userAdministration.userList: userListController', function() {
    var $controllerConstructor;

    var mockUser;
    var mockUserConstructor;
    var mockUserEditor;

    var saveDfd;
    var scope;

    var EditorMode;

    beforeEach(module('homeTrax.userAdministration.userList'));

    beforeEach(inject(function($rootScope, $controller, $q, _EditorMode_) {
      $controllerConstructor = $controller;
      saveDfd = $q.defer();
      scope = $rootScope;
      EditorMode = _EditorMode_;
    }));

    beforeEach(function() {
      buildMockUser();
      buildMockUserEditor();
    });

    function buildMockUser() {
      mockUser = {};
      mockUserConstructor = sinon.stub().returns(mockUser);
      mockUserConstructor.query = sinon.stub();
    }

    function buildMockUserEditor() {
      mockUserEditor = sinon.stub({
        open: function() {}
      });
      mockUserEditor.open.returns({
        result: saveDfd.promise
      });
    }

    function createController() {
      return $controllerConstructor('userListController', {
        User: mockUserConstructor,
        userEditor: mockUserEditor
      });
    }

    describe('Initialization', function() {
      it('calls the user service to get a list of users', function() {
        createController();
        expect(mockUserConstructor.query.called).to.be.true;
      });

      it('assigns the results to the users', function() {
        mockUserConstructor.query.returns('Results of the query');
        var controller = createController();
        expect(controller.users).to.equal('Results of the query');
      });
    });

    describe('Editing Existing User', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
      });

      it('opens the edit', function() {
        var user = {
          name: 'Fred Flintstone'
        };
        controller.edit(user);
        expect(mockUserEditor.open.calledOnce).to.be.true;
        expect(mockUserEditor.open.calledWithExactly(user, EditorMode.edit)).to.be.true;
      });
    });

    describe('Creating New User', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
      });

      it('news up a user resource', function() {
        controller.create();
        expect(mockUserConstructor.calledOnce).to.be.true;
      });

      it('opens the edit', function() {
        controller.create();
        expect(mockUserEditor.open.calledOnce).to.be.true;
        expect(mockUserEditor.open.calledWith(mockUser, EditorMode.create)).to.be.true;
      });

      it('pushes the new user', function() {
        mockUserConstructor.query.returns([1, 2, 3, 4, 5, 6]);
        var controller = createController();
        controller.create();
        saveDfd.resolve(mockUser);
        scope.$digest();
        expect(controller.users).to.deep.equal([1, 2, 3, 4, 5, 6, mockUser]);
      });
    });
  });
}());
