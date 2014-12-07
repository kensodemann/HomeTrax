/*jshint expr: true*/
(function() {
  'use strict';

  describe('userListCtrl', function() {
    var $controllerConstructor;
    var q;

    var mockUser;
    var mockUserConstructor;
    var mockUserEditor;

    beforeEach(module('app.account'));

    beforeEach(inject(function($controller, $q) {
      $controllerConstructor = $controller;
      q = $q;
    }));

    beforeEach(function() {
      buildMockUser();
      buildMockUserEditor();
    });

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

    function buildMockUserEditor() {
      mockUserEditor = sinon.stub({
        open: function() {
        }
      });
    }

    function createController() {
      return $controllerConstructor('userListCtrl', {
        User: mockUserConstructor,
        userEditor: mockUserEditor
      });
    }

    describe('Initialization', function() {
      it('calls the user service to get a list of users', function() {
        createController();
        expect(mockUserConstructor.query.called).to.be.true;
      });

      it('assigns the results to the users', function(){
        mockUserConstructor.query.returns('Results of the query');
        var ctrl = createController();
        expect(ctrl.users).to.equal('Results of the query');
      });
    });

    describe('Editing Existing User', function() {
      var ctrl;
      beforeEach(function() {
        ctrl = createController();
      });

      it('opens the editor', function() {
        var user = {
          name: 'Fred Flintstone'
        };
        ctrl.edit(user);
        expect(mockUserEditor.open.calledOnce).to.be.true;
        expect(mockUserEditor.open.calledWithExactly(user, 'edit')).to.be.true;
      });
    });

    describe('Creating New User', function() {
      var ctrl;
      beforeEach(function() {
        ctrl = createController();
      });

      it('news up a user resource', function(){
        ctrl.create();
        expect(mockUserConstructor.calledOnce).to.be.true;
      });

      it('opens the editor', function() {
        ctrl.create();
        expect(mockUserEditor.open.calledOnce).to.be.true;
        expect(mockUserEditor.open.calledWithExactly(mockUser, 'create')).to.be.true;
      });
    });
  });
}());