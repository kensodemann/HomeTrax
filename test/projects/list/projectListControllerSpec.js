/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('projectListController', function() {
    var mockMessageDialog;
    var mockModalInstance;
    var mockProject;
    var mockProjectConstructor;
    var mockProjectEditor;

    var $controllerConstructor;
    var EditorMode;

    var queryDfd;
    var resultDfd;
    var scope;
    var testProjects;

    beforeEach(module('homeTrax.projects.list'));

    beforeEach(inject(function($rootScope, $controller, $q, _EditorMode_) {
      scope = $rootScope.$new();
      $controllerConstructor = $controller;
      queryDfd = $q.defer();
      resultDfd = $q.defer();
      EditorMode = _EditorMode_;
    }));

    beforeEach(initializeTestData);

    beforeEach(function() {
      mockProject = {};
      mockProjectConstructor = sinon.stub();
      mockProjectConstructor.returns(mockProject);
      mockProjectConstructor.query = sinon.stub();
      mockProjectConstructor.query.returns(testProjects);
    });

    beforeEach(function() {
      mockMessageDialog = sinon.stub({
        error: function() {}
      });
    });

    beforeEach(function() {
      mockModalInstance = {
        result: resultDfd.promise
      };
    });

    beforeEach(function() {
      mockProjectEditor = sinon.stub({
        open: function() {}
      });
      mockProjectEditor.open.returns(mockModalInstance);
    });

    function createController() {
      return $controllerConstructor('projectListController', {
        Project: mockProjectConstructor,
        projectEditor: mockProjectEditor,
        messageDialog: mockMessageDialog
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activation', function() {
      it('flags the controller as querying projects', function() {
        var controller = createController();
        expect(controller.isQuerying).to.be.true;
      });

      it('queries the projects', function() {
        createController();
        expect(mockProjectConstructor.query.calledOnce).to.be.true;
      });

      it('assigns the projects', function() {
        var controller = createController();
        expect(controller.projects).to.deep.equal(testProjects);
      });

      it('clears the "is querying" flag when the query completes', function() {
        var controller = createController();
        queryDfd.resolve();
        scope.$digest();
        expect(controller.isQuerying).to.be.false;
      });

      it('displays error message if query fails', function() {
        createController();
        queryDfd.reject({
          data: {
            reason: 'Because you suck eggs'
          }
        });
        scope.$digest();
        expect(mockMessageDialog.error.calledOnce).to.be.true;
        expect(mockMessageDialog.error.calledWith('Error', 'Because you suck eggs')).to.be.true;
      });
    });

    describe('creating a new project', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        queryDfd.resolve();
        scope.$digest();
      });

      it('creates a new project resource', function() {
        controller.newProject();
        expect(mockProjectConstructor.calledOnce).to.be.true;
      });

      it('opens the project editor', function() {
        controller.newProject();
        expect(mockProjectEditor.open.calledOnce).to.be.true;
      });

      it('passes the new project to the editor, opened in create mode', function() {
        controller.newProject();
        expect(mockProjectEditor.open.calledWith(mockProject, EditorMode.create));
      });

      it('adds the project to the list if it is saved', function() {
        controller.newProject();
        resultDfd.resolve({
          _id: 6,
          name: 'The New One'
        });
        scope.$digest();
        expect(controller.projects.length).to.equal(6);
        expect(controller.projects[5]).to.deep.equal({
          _id: 6,
          name: 'The New One'
        });
      });
    });

    describe('modifying an existing project', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        queryDfd.resolve();
        scope.$digest();
      });

      it('opens the editor', function() {
        controller.editProject(testProjects[3]);
        expect(mockProjectEditor.open.calledOnce).to.be.true;
      });

      it('opens the editor in edit mode passing the specified project', function() {
        controller.editProject(testProjects[3]);
        expect(mockProjectEditor.open.calledWith(testProjects[3], EditorMode.edit)).to.be.true;
      });
    });

    function initializeTestData() {
      testProjects = [{
        _id: 1,
        name: 'Test #1'
      }, {
        _id: 2,
        name: 'Test #2'
      }, {
        _id: 3,
        name: 'Test #3'
      }, {
        _id: 4,
        name: 'Test #4'
      }, {
        _id: 5,
        name: 'Test #5'
      }];
      testProjects.$promise = queryDfd.promise;
    }
  });
}());
