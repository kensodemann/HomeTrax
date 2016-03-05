/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('messageDialog', function() {
    var mockModal;
    var mockModalInstance;
    var messageDialog;

    beforeEach(module('homeTrax.common.services.messageDialog'));

    beforeEach(function() {
      mockModalInstance = {};
      mockModal = sinon.stub({
        open: function() {}
      });
      mockModal.open.returns(mockModalInstance);

      module(function($provide) {
        $provide.value('$uibModal', mockModal);
      });
    });

    beforeEach(inject(function(_messageDialog_) {
      messageDialog = _messageDialog_;
    }));

    it('exists', function() {
      expect(messageDialog).to.exist;
    });

    describe('ask', function() {
      it('opens the modal', function() {
        messageDialog.ask();
        expect(mockModal.open.calledOnce).to.be.true;
      });

      it('returns the modal instance', function() {
        var m = messageDialog.ask();
        expect(m).to.equal(mockModalInstance);
      });
    });
  });
}());
