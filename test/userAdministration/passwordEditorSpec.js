(function() {
  'use strict';

  describe('homeTrax.userAdministration.passwordEditor', function() {
    var mockModal;
    var mockModalInstance;
    var passwordEditor;

    beforeEach(module('homeTrax.userAdministration.passwordEditor'));

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

    beforeEach(inject(function(_passwordEditor_) {
      passwordEditor = _passwordEditor_;
    }));

    it('exists', function() {
      expect(passwordEditor).to.exist;
    });

    describe('open', function() {
      it('opens the modal', function() {
        passwordEditor.open();
        expect(mockModal.open.calledOnce).to.be.true;
      });

      it('returns the modal instance', function() {
        var m = passwordEditor.open();
        expect(m).to.equal(mockModalInstance);
      });
    });
  });
}());