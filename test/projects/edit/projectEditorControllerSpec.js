(function() {
  'use strict';

  describe('homeTrax.projects.edit: projectEditorController', function() {
    var mockModalInstance;
    var mockNotifier;
    var $controllerConstructor;

    var EditorMode;
    var Status;

    beforeEach(module('homeTrax.projects.edit'));

    beforeEach(inject(function($controller, _EditorMode_, _Status_) {
      $controllerConstructor = $controller;
      EditorMode = _EditorMode_;
      Status = _Status_;
    }));

    beforeEach(function() {
      mockModalInstance = sinon.stub({
        close: function() {
        }
      });
    });

    beforeEach(function() {
      mockNotifier = sinon.stub({
        error: function() {
        },

        notify: function() {
        }
      });
    });

    function createController(project, mode) {
      return $controllerConstructor('projectEditorController', {
        $modalInstance: mockModalInstance,
        notifier: mockNotifier,
        project: project || {},
        mode: mode
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activation', function() {
      it('sets the name', function() {
        var controller = createController({
          name: 'Hot Sauce Production',
          jiraTaskId: 'FHS-123',
          sbvbTaskId: 'RFP12312',
          status: Status.active
        });
        expect(controller.name).to.equal('Hot Sauce Production');
      });

      it('sets the Jira task ID', function() {
        var controller = createController({
          name: 'Hot Sauce Production',
          jiraTaskId: 'FHS-123',
          sbvbTaskId: 'RFP12312',
          status: Status.active
        });
        expect(controller.jiraTaskId).to.equal('FHS-123');
      });

      it('sets the SBVB task ID', function() {
        var controller = createController({
          name: 'Hot Sauce Production',
          jiraTaskId: 'FHS-123',
          sbvbTaskId: 'RFP12312',
          status: Status.active
        });
        expect(controller.sbvbTaskId).to.equal('RFP12312');
      });

      it('sets the active flag if active', function() {
        var controller = createController({
          name: 'Hot Sauce Production',
          jiraTaskId: 'FHS-123',
          sbvbTaskId: 'RFP12312',
          status: Status.active
        });
        expect(controller.isActive).to.be.true;
      });

      it('clears the active flag if not active', function() {
        var controller = createController({
          name: 'Hot Sauce Production',
          jiraTaskId: 'FHS-123',
          sbvbTaskId: 'RFP12312',
          status: Status.inactive
        });
        expect(controller.isActive).to.be.false;
      });

      it('defaults to active when in create mode', function() {
        var controller = createController({}, EditorMode.create);
        expect(controller.isActive).to.be.true;
      });

      it('sets the title for create', function() {
        var controller = createController({}, EditorMode.create);
        expect(controller.title).to.equal('Create New Project');
      });

      it('sets the title for edit', function() {
        var controller = createController({}, EditorMode.edit);
        expect(controller.title).to.equal('Modify Project');
      });
    });

    describe('saving', function() {
      var controller;
      var project;
      beforeEach(function() {
        project = {
          $save: sinon.stub()
        };
        controller = createController(project);
      });

      it('copies the project name to the project', function() {
        controller.name = 'New Project';
        controller.save();
        expect(project.name).to.equal('New Project');
      });

      it('copies the Jira Task to the project', function() {
        controller.jiraTaskId = 'AA-301';
        controller.save();
        expect(project.jiraTaskId).to.equal('AA-301');
      });

      it('copies the SBVB Task to the project', function() {
        controller.sbvbTaskId = 'RFP14114';
        controller.save();
        expect(project.sbvbTaskId).to.equal('RFP14114');
      });

      it('sets the project to active if isActive', function() {
        controller.isActive = true;
        controller.save();
        expect(project.status).to.equal(Status.active);
      });

      it('sets the project to inactive if not isActive', function() {
        controller.isActive = false;
        controller.save();
        expect(project.status).to.equal(Status.inactive);
      });

      it('saves the project', function() {
        controller.save();
        expect(project.$save.calledOnce).to.be.true;
      });

      it('closes the editor if the save succeeds', function() {
        controller.save();
        project.$save.yield(project);
        expect(mockModalInstance.close.calledOnce).to.be.true;
        expect(mockModalInstance.close.calledWith(project)).to.be.true;
      });

      it('sets an error message for display on error', function() {
        controller.save();
        project.$save.callArg(1, {
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
}());
