/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.taskTimers.edit.taskTimerEditorService', function() {
    var config;
    var $httpBackend;
    var Status;
    var taskTimerEditorService;

    beforeEach(module('homeTrax.taskTimers.edit.taskTimerEditorService'));

    beforeEach(inject(function(_$httpBackend_, _config_, _Status_, _taskTimerEditorService_) {
      config = _config_;
      $httpBackend = _$httpBackend_;
      Status = _Status_;
      taskTimerEditorService = _taskTimerEditorService_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('exists', function() {
      expect(taskTimerEditorService).to.exist;
    });

    describe('getting active projects', function() {
      it('queries all active projects', function() {
        $httpBackend.expectGET(config.dataService + '/projects?status=' + Status.active)
          .respond([]);
        taskTimerEditorService.getActiveProjects();
        $httpBackend.flush();
      });

      it('resolves the active projects', function(done) {
        $httpBackend.expectGET(config.dataService + '/projects?status=' + Status.active)
          .respond([{
            _id: 1234,
            name: 'Eat Cake',
            jiraTaskId: 'AA-101'
          }, {
            _id: 9876,
            name: 'Drink Coffee',
            jiraTaskId: 'AA-101',
            sbvbTaskId: 'PL02104995'
          }, {
            _id: 4312,
            name: 'Poop',
            sbvbTaskId: 'WO03002939'
          }, {
            _id: 7385,
            name: 'Sleep'
          }]);
        taskTimerEditorService.getActiveProjects().then(function(prjs) {
          expect(prjs.length).to.equal(4);
          done();
        });

        $httpBackend.flush();
      });

      it('wraps the projects manufacturing a display name', function(done) {
        $httpBackend.expectGET(config.dataService + '/projects?status=' + Status.active)
          .respond([{
            _id: 1234,
            name: 'Eat Cake',
            jiraTaskId: 'AA-101'
          }, {
            _id: 9876,
            name: 'Drink Coffee',
            jiraTaskId: 'AA-102',
            sbvbTaskId: 'PL02104995'
          }, {
            _id: 4312,
            name: 'Poop',
            sbvbTaskId: 'WO03002939'
          }, {
            _id: 7385,
            name: 'Sleep'
          }]);
        taskTimerEditorService.getActiveProjects().then(function(prjs) {
          expect(prjs[0].displayName).to.equal('Eat Cake [AA-101]');
          expect(prjs[1].displayName).to.equal('Drink Coffee [AA-102] (PL02104995)');
          expect(prjs[2].displayName).to.equal('Poop (WO03002939)');
          expect(prjs[3].displayName).to.equal('Sleep');
          done();
        });

        $httpBackend.flush();
      });
    });

    describe('selecting a project', function() {
      var projects;
      beforeEach(function(done) {
        $httpBackend.expectGET(config.dataService + '/projects?status=' + Status.active)
          .respond([{
            _id: 1234,
            name: 'Eat Cake',
            jiraTaskId: 'AA-101'
          }, {
            _id: 9876,
            name: 'Drink Coffee',
            jiraTaskId: 'AA-102',
            sbvbTaskId: 'PL02104995'
          }, {
            _id: 4312,
            name: 'Poop',
            sbvbTaskId: 'WO03002939'
          }, {
            _id: 7385,
            name: 'Sleep'
          }]);
        taskTimerEditorService.getActiveProjects().then(function(prjs) {
          projects = prjs;
          done();
        });

        $httpBackend.flush();
      });

      it('selects the specified project if it exists in the project list', function() {
        var p = taskTimerEditorService.selectProject(projects, {_id: 9876});
        expect(p).to.equal(projects[1]);
      });

      it('wraps, adds, and selects the project if it does not exist already', function() {
        var p = taskTimerEditorService.selectProject(projects, {
          _id: 314159,
          name: 'Be a Nuisance',
          jiraTaskId:'UAW-101'
        });

        expect(projects.length).to.equal(5);
        expect(p).to.equal(projects[4]);
        expect(p.displayName).to.equal('Be a Nuisance [UAW-101]');
      });
    });
  });
}());
