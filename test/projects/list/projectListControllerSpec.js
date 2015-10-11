(function() {
  'use strict';

  describe('projectListController', function() {
    var mockProject;
    var $controllerConstructor;

    var queryDfd;
    var scope;
    var testProjects;

    beforeEach(module('homeTrax.projects.list'));

    beforeEach(inject(function($rootScope, $controller, $q) {
      scope = $rootScope.$new();
      $controllerConstructor = $controller;
      queryDfd = $q.defer();
    }));

    beforeEach(initializeTestData);

    beforeEach(function() {
      mockProject = sinon.stub({
        query: function() {
        }
      });
      mockProject.query.returns(testProjects);
    });

    function createController() {
      return $controllerConstructor('projectListController', {
        Project: mockProject
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
        expect(mockProject.query.calledOnce).to.be.true;
      });

      it('assigns the projects', function() {
        var controller = createController();
        expect(controller.projects).to.deep.equal(testProjects);
      });

      it('clears the "is querying" flag when the query completes', function(){
        var controller = createController();
        queryDfd.resolve();
        scope.$digest();
        expect(controller.isQuerying).to.be.false;
      })
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