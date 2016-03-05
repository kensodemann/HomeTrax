/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.projects.edit.projectEditor', function() {
    var mockModal;
    var mockModalInstance;
    var projectEditor;

    beforeEach(module('homeTrax.projects.edit.projectEditor'));

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

    beforeEach(inject(function(_projectEditor_) {
      projectEditor = _projectEditor_;
    }));

    it('exists', function() {
      expect(projectEditor).to.exist;
    });

    describe('open', function() {
      it('opens the modal', function() {
        projectEditor.open();
        expect(mockModal.open.calledOnce).to.be.true;
      });

      it('returns the modal instance', function() {
        var m = projectEditor.open();
        expect(m).to.equal(mockModalInstance);
      });
    });
  });
}());
