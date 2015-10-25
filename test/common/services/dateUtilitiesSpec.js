(function() {
  'use strict';

  describe('date utilities service', function() {
    var dateUtilities;

    beforeEach(module('homeTrax.common.services.dateUtilities'));

    beforeEach(inject(function(_dateUtilities_) {
      dateUtilities = _dateUtilities_;
    }));

    it('exists', function() {
      expect(dateUtilities)
        .to.exist;
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

    describe('work week generator', function() {
      it('creates a 7 day week', function() {
        var days = dateUtilities.generateWeek(new Date());
        expect(days.length).to.equal(7);
      });

      it('starts the week on Sunday', function() {
        var days = dateUtilities.generateWeek(new Date(2015, 9, 22));
        var expectedDate = new Date(2015, 9, 18);
        expect(days[0].date.toJSON()).to.equal(expectedDate.toJSON());
      });

      it('sequences the dates in the week', function() {
        var days = dateUtilities.generateWeek(new Date(2015, 9, 22));
        var expectedDate1 = new Date(2015, 9, 19);
        var expectedDate3 = new Date(2015, 9, 21);
        var expectedDate6 = new Date(2015, 9, 24);
        expect(days[1].date.toJSON()).to.equal(expectedDate1.toJSON());
        expect(days[3].date.toJSON()).to.equal(expectedDate3.toJSON());
        expect(days[6].date.toJSON()).to.equal(expectedDate6.toJSON());
      });

      it('saves the ISO date string for each day', function() {
        var days = dateUtilities.generateWeek(new Date(2015, 9, 22));
        expect(days[0].isoDateString).to.equal('2015-10-18');
        expect(days[1].isoDateString).to.equal('2015-10-19');
        expect(days[2].isoDateString).to.equal('2015-10-20');
        expect(days[3].isoDateString).to.equal('2015-10-21');
        expect(days[4].isoDateString).to.equal('2015-10-22');
        expect(days[5].isoDateString).to.equal('2015-10-23');
        expect(days[6].isoDateString).to.equal('2015-10-24');
      });

      it('generates the same week for the week end date', function() {
        var dt = dateUtilities.addTimezoneOffset(new Date('2015-10-24'));
        var days = dateUtilities.generateWeek(dt);
        expect(days[0].isoDateString).to.equal('2015-10-18');
        expect(days[1].isoDateString).to.equal('2015-10-19');
        expect(days[2].isoDateString).to.equal('2015-10-20');
        expect(days[3].isoDateString).to.equal('2015-10-21');
        expect(days[4].isoDateString).to.equal('2015-10-22');
        expect(days[5].isoDateString).to.equal('2015-10-23');
        expect(days[6].isoDateString).to.equal('2015-10-24');
      });

      it('generates starting with today if today is Sunday', function() {
        var dt = dateUtilities.addTimezoneOffset(new Date('2015-10-25'));
        var days = dateUtilities.generateWeek(dt);
        expect(days[0].isoDateString).to.equal('2015-10-25');
        expect(days[1].isoDateString).to.equal('2015-10-26');
        expect(days[2].isoDateString).to.equal('2015-10-27');
        expect(days[3].isoDateString).to.equal('2015-10-28');
        expect(days[4].isoDateString).to.equal('2015-10-29');
        expect(days[5].isoDateString).to.equal('2015-10-30');
        expect(days[6].isoDateString).to.equal('2015-10-31');
      });
    });

    describe('week end date calculator', function() {
      it('calculates today if Saturday is passed', function() {
        var dt = dateUtilities.weekEndDate(new Date(2015, 9, 31));
        expect(dt.toJSON().substring(0, 10)).to.equal('2015-10-31');
      });

      it('calculates next Saturday if Sunday is passed', function() {
        var dt = dateUtilities.weekEndDate(new Date(2015, 9, 25));
        expect(dt.toJSON().substring(0, 10)).to.equal('2015-10-31');
      });

      it('calculates next Saturday for any day in between', function() {
        var dt = dateUtilities.weekEndDate(new Date(2015, 9, 21));
        expect(dt.toJSON().substring(0, 10)).to.equal('2015-10-24');
      });
    });
  });
})();
