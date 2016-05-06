/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.taskTimers.edit.taskTimerEditorController', function() {
    var mockModalInstance;
    var mockNotifier;
    var mockStages;
    var mockTaskTimerEditorService;

    var projectsDfd;
    var stagesDfd;
    var testStages;

    var $controllerConstructor;
    var EditorMode;
    var $rootScope;

    beforeEach(module('homeTrax.taskTimers.edit.taskTimerEditorController'));

    beforeEach(inject(function($q, $controller, _$rootScope_, _EditorMode_) {
      $controllerConstructor = $controller;
      EditorMode = _EditorMode_;
      stagesDfd = $q.defer();
      projectsDfd = $q.defer();
      $rootScope = _$rootScope_;
    }));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(function() {
      mockModalInstance = sinon.stub({
        close: function() {
        }
      });
    });

    beforeEach(function() {
      mockNotifier = sinon.stub({
        error: function() {
        }
      });
    });

    beforeEach(function() {
      mockTaskTimerEditorService = sinon.stub({
        getActiveProjects: function() {
        },

        selectProject: function() {
        }
      });
      mockTaskTimerEditorService.getActiveProjects.returns(projectsDfd.promise);
    });

    beforeEach(function() {
      mockStages = {
        all: testStages
      };
    });

    function createController(taskTimer, mode) {
      return $controllerConstructor('taskTimerEditorController', {
        $uibModalInstance: mockModalInstance,
        taskTimerEditorService: mockTaskTimerEditorService,
        stages: mockStages,
        taskTimer: taskTimer || {},
        mode: mode,
        notifier: mockNotifier
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activation', function() {
      it('sets the title for edit mode', function() {
        var controller = createController({}, EditorMode.edit);
        expect(controller.title).to.equal('Edit Task Timer');
      });

      it('sets the title for create mode', function() {
        var controller = createController({}, EditorMode.create);
        expect(controller.title).to.equal('New Task Timer');
      });

      it('converts the number of milliseconds to a string', function() {
        var controller = createController({
          milliseconds: 5400000
        });
        expect(controller.timeSpent).to.equal('1:30');
      });

      it('gets the list of active projects', function() {
        createController();
        expect(mockTaskTimerEditorService.getActiveProjects.calledOnce).to.be.true;
      });

      it('assigns the fetched projects', function() {
        var controller = createController();
        var projects = ['these are projects'];
        projectsDfd.resolve(projects);
        $rootScope.$digest();
        expect(controller.projects).to.equal(projects);
      });

      it('gets the list of stages', function() {
        var controller = createController();
        expect(controller.stages).to.equal(mockStages.all);
      });

      it('sets the task to the task on the timer', function() {
        var controller = createController({
          stage: {
            _id: 3221
          }
        }, EditorMode.edit);
        stagesDfd.resolve(testStages);
        $rootScope.$digest();
        expect(controller.stage).to.equal(testStages[2]);
      });

      it('sets the project to the project on the timer', function() {
        var projects = [1, 2, 7, 6];
        var controller = createController({
          project: {
            _id: 314159
          },
          stage: {
            _id: 3221
          }
        }, EditorMode.edit);
        mockTaskTimerEditorService.selectProject.returns('IAmTheProject');
        projectsDfd.resolve(projects);
        $rootScope.$digest();
        expect(mockTaskTimerEditorService.selectProject.calledOnce).to.be.true;
        expect(mockTaskTimerEditorService.selectProject.calledWith(projects, {_id: 314159})).to.be.true;
        expect(controller.project).to.equal('IAmTheProject');
      });

      it('does not attempt to set the project if the editor is in create mode', function() {
        var projects = [1, 2, 7, 6];
        createController({}, EditorMode.create);
        projectsDfd.resolve(projects);
        $rootScope.$digest();
        expect(mockTaskTimerEditorService.selectProject.called).to.be.false;
      });
    });

    describe('save', function() {
      var taskTimer;
      var controller;
      beforeEach(function() {
        taskTimer = {
          isActive: false,
          $save: sinon.stub()
        };
        controller = createController(taskTimer);
        controller.project = {
          displayName: 'Sheldon Cooper',
          resource: {
            _id: 73,
            name: 'Sheldon Cooper'
          }
        };
      });

      it('copies the selected stage to the taskTimer', function() {
        controller.stage = {
          _id: 13,
          name: 'Getting Lucky'
        };
        controller.save();
        expect(taskTimer.stage).to.deep.equal({
          _id: 13,
          name: 'Getting Lucky'
        });
      });

      it('copies the selected project to the taskTimer', function() {
        controller.project = {
          displayName: 'Douglas Adams',
          resource: {
            _id: 42,
            name: 'Hitchhiking'
          }
        };
        controller.save();
        expect(taskTimer.project).to.deep.equal({
          _id: 42,
          name: 'Hitchhiking'
        });
      });

      it('copies the entered time to the taskTimer if the timer is not active', function() {
        controller.timeSpent = '1:45';
        controller.save();
        expect(taskTimer.milliseconds).to.equal(6300000);
      });

      it('does not copy the entered time to the taskTimer if the timer is active', function() {
        taskTimer.isActive = true;
        controller.timeSpent = '1:45';
        controller.save();
        expect(taskTimer.milliseconds).to.not.exist;
      });

      it('saves the taskTimer', function() {
        controller.save();
        expect(taskTimer.$save.calledOnce).to.be.true;
      });

      it('sets the isSaving flag', function() {
        controller.save();
        expect(controller.isSaving).to.be.true;
      });

      describe('when successful', function() {
        it('clears the isSaving flag', function() {
          controller.save();
          expect(controller.isSaving).to.be.true;
          taskTimer.$save.yield();
          expect(controller.isSaving).to.be.false;
        });

        it('closes the modal instance', function() {
          var taskTimerSaveResponse = {};
          controller.save();
          taskTimer.$save.yield(taskTimerSaveResponse);
          expect(mockModalInstance.close.calledOnce).to.be.true;
          expect(mockModalInstance.close.calledWith(taskTimerSaveResponse)).to.be.true;
        });
      });

      describe('when failed', function() {
        it('clears the isSaving flag', function() {
          controller.save();
          expect(controller.isSaving).to.be.true;
          taskTimer.$save.callArg(1, {
            data: {
              reason: 'Because you suck eggs'
            }
          });
          expect(controller.isSaving).to.be.false;
        });

        it('sets an error message for display', function() {
          controller.save();
          taskTimer.$save.callArg(1, {
            data: {
              reason: 'Because you suck eggs'
            }
          });
          expect(mockModalInstance.close.called).to.be.false;
          expect(mockNotifier.error.calledOnce).to.be.true;
          expect(mockNotifier.error.calledWith('Because you suck eggs')).to.be.true;
          expect(controller.errorMessage).to.equal('Because you suck eggs');
        });
      });
    });

    function initializeTestData() {
      testStages = [{
        _id: 1234,
        stageNumber: 1,
        name: 'Requirements Definition'
      }, {
        _id: 4312,
        stageNumber: 2,
        name: 'Functional Specification'
      }, {
        _id: 3221,
        stageNumber: 3,
        name: 'Detailed Design'
      }, {
        _id: 9989,
        stageNumber: 4,
        name: 'Coding'
      }];
      testStages.$promise = stagesDfd.promise;
    }
  });
}());
