/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('householdCtrl', function() {
    beforeEach(module('app.household'));

    var controllerConstructor;

    beforeEach(inject(function($controller) {
      controllerConstructor = $controller;
    }));

    function createController() {
      return controllerConstructor('householdCtrl', {});
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.not.be.undefined;
    });

    describe('tabs', function() {
      it('sets up four tabs', function() {
        var ctrl = createController();
        expect(ctrl.tabs.length).to.equal(4);
      });

      describe('labels', function() {
        it('first tab is "Information"', function() {
          var ctrl = createController();
          expect(ctrl.tabs[0].title).to.equal('Information');
        });

        it('first tab is "Schedule"', function() {
          var ctrl = createController();
          expect(ctrl.tabs[1].title).to.equal('Schedule');
        });

        it('first tab is "History"', function() {
          var ctrl = createController();
          expect(ctrl.tabs[2].title).to.equal('History');
        });

        it('first tab is "Appliances"', function() {
          var ctrl = createController();
          expect(ctrl.tabs[3].title).to.equal('Appliances');
        });
      });
    });
  });
})();