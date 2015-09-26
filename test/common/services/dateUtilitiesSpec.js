(function() {
  'use strict';

  describe('date utilities service', function() {
    var dateUtilities;

    beforeEach(module('homeTrax.common.services.dateUtilities'));

    beforeEach(inject(function(_dateUtilities_) {
      dateUtilities = _dateUtilities_;
    }));

    it('exists', function() {
      expect(dateUtilities).to.exist;
    });

    describe('date normalization', function() {
      // ES-5 dates always include a time component and that time component is always TZ aware.
      //
      // It is often the case that the time is not important (we just want a date, like 05/15/2015), or
      // the timezone isn't important (I want to be reminded at 7:00am, whatever timezone I happen to be in).
      // In these cases, ES-5's date and TZ handling gets in the way.
      //
      // Working in concert with on another, these two functions strip off the timezone for saving
      // the date, and re-apply the timezone for display of a fetched date.
      describe('remove timezone', function() {
        it('removes the current timezone offset from the date', function() {
          var date = new Date(2013, 4, 3);
          var adjustedDate = dateUtilities.removeTimezoneOffset(date);
          expect(adjustedDate.toJSON()).to.equal('2013-05-03T00:00:00.000Z');
        });
      });

      describe('add timezone', function() {
        it('adds the current timezone offset to the date', function() {
          var date = new Date('2013-05-03T00:00:00.000Z');
          var adjustedDate = dateUtilities.addTimezoneOffset(date);
          expect(adjustedDate).to.deep.equal(new Date(2013, 4, 3));
        });
      });
    });

  });
})();