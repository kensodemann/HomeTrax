/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.taskTimers.edit.taskTimerEditor', function() {
    var mockModal;
    var mockModalInstance;
    var taskTimerEditor;

    beforeEach(module('homeTrax.taskTimers.edit.taskTimerEditor'));

    beforeEach(function() {
      mockModalInstance = {};
      mockModal = sinon.stub({
        open: function() {
        }
      });
      mockModal.open.returns(mockModalInstance);

      module(function($provide) {
        $provide.value('$uibModal', mockModal);
      });
    });

    beforeEach(inject(function(_taskTimerEditor_) {
      taskTimerEditor = _taskTimerEditor_;
    }));

    it('exists', function() {
      expect(taskTimerEditor).to.exist;
    });

    describe('open', function() {
      it('opens the modal', function() {
        taskTimerEditor.open();
        expect(mockModal.open.calledOnce).to.be.true;
      });

      it('returns the modal instance', function() {
        var m = taskTimerEditor.open();
        expect(m).to.equal(mockModalInstance);
      });
    });
  });
}());
