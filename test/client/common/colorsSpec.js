/* global beforeEach describe expect inject it */
(function() {
  'use strict';

  describe('colors service', function() {
    var serviceUnderTest;

    beforeEach(module('app.core'));

    beforeEach(inject(function(colors) {
      serviceUnderTest = colors;
    }));

    it('exists', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    describe('user colors', function() {
      it('returns nine colors', function() {
        var colors = serviceUnderTest.userColors;
        expect(colors.length).to.equal(9);
      });
    });

    describe('event colors', function() {
      it('contains nine colors', function() {
        var colors = serviceUnderTest.eventColors;
        expect(colors.length).to.equal(9);
      });

      it('does not overlap with the user colors', function() {
        serviceUnderTest.eventColors.forEach(function(color) {
          expect(serviceUnderTest.userColors.indexOf(color)).to.equal(-1);
        });
      });
    });
  });
})();