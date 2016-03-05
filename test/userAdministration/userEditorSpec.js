/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.userAdministration.userEditor', function() {
    var mockModal;
    var mockModalInstance;
    var userEditor;

    beforeEach(module('homeTrax.userAdministration.userEditor'));

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

    beforeEach(inject(function(_userEditor_) {
      userEditor = _userEditor_;
    }));

    it('exists', function() {
      expect(userEditor).to.exist;
    });

    describe('open', function() {
      it('opens the modal', function() {
        userEditor.open();
        expect(mockModal.open.calledOnce).to.be.true;
      });

      it('returns the modal instance', function() {
        var m = userEditor.open();
        expect(m).to.equal(mockModalInstance);
      });
    });
  });
}());
