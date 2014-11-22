'use strict';

describe('messageDialogService', function() {
  var scope;
  var dfd;
  var mockModal;
  var mockModalConstructor;
  var serviceUnderTest;

  beforeEach(module('app'));

  beforeEach(function() {
    mockModal = sinon.stub({
      show: function() {
      },
      hide: function() {
      }
    });
    mockModal.$promise = sinon.stub({
      then: function() {
      }
    });
    mockModalConstructor = sinon.stub().returns(mockModal);

    module(function($provide) {
      $provide.value('$modal', mockModalConstructor);
    });
  });

  beforeEach(inject(function($rootScope, $q, messageDialogService) {
    scope = $rootScope;
    dfd = $q.defer();
    serviceUnderTest = messageDialogService;
  }));

  it('exists', function() {
    expect(serviceUnderTest).to.not.be.undefined;
  });

  describe('Ask Dialog', function() {
    it('sets the message and the title', function() {
      var dlg = getDialog();
      serviceUnderTest.ask('this is a question?', 'ask it');
      expect(dlg.title).to.equal('ask it');
      expect(dlg.question).to.equal('this is a question?');
    });

    it('shows the dialog when it is ready', function() {
      serviceUnderTest.ask();
      expect(mockModal.show.called).to.be.false;
      mockModal.$promise.then.yield();
      expect(mockModal.show.calledOnce).to.be.true;
    });

    describe('yes', function(){
      it('resolves true', function(done){
        serviceUnderTest.ask().then(function(answer){
          expect(answer).to.be.true;
          done();
        });

        var dlg = getDialog();
        dlg.yes();
        dlg.$digest();
      });

      it('hides the modal', function(){
        serviceUnderTest.ask();
        var dlg = getDialog();
        dlg.yes();
        expect(mockModal.hide.calledOnce).to.be.true;
      });
    });

    describe('no',function(){
      it('resolves false', function(done){
        serviceUnderTest.ask().then(function(answer){
          expect(answer).to.be.false;
          done();
        });

        var dlg = getDialog();
        dlg.no();
        dlg.$digest();
      });

      it('hides the modal', function(){
        serviceUnderTest.ask();
        var dlg = getDialog();
        dlg.no();
        expect(mockModal.hide.calledOnce).to.be.true;
      });
    });


    function getDialog() {
      return mockModalConstructor.getCall(0).args[0].scope;
    }
  });
});