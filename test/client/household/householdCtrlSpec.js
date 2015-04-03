/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('householdCtrl', function() {
    beforeEach(module('app.household'));

    var dfd;
    var mockHouseholdData;
    var controllerConstructor;

    beforeEach(inject(function($controller, $q) {
      controllerConstructor = $controller;
      dfd = $q.defer();
    }));

    beforeEach(function() {
      mockHouseholdData = sinon.stub({
        load: function() {}
      });
      mockHouseholdData.load.returns(dfd.promise);
    });

    function createController() {
      return controllerConstructor('householdCtrl', {
        householdData: mockHouseholdData
      });
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.not.be.undefined;
    });

    describe('instantiation', function() {
      it('loads the data', function() {
        createController();
        expect(mockHouseholdData.load.calledOnce).to.be.true;
      });

      it('sets up the header lines', function() {
        var ctrl = createController();
        expect(ctrl.headerLines.length).to.equal(8);
      });

      it('sets up the basic information lines', function() {
        var ctrl = createController();
        expect(ctrl.basicInformation.length).to.equal(2);
        expect(ctrl.basicInformation[0].length).to.equal(4);
        expect(ctrl.basicInformation[1].length).to.equal(2);
      });
    });
  });
})();