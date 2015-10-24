(function() {
  'use strict';

  describe('homeTrax.common.filters: hours and minutes formatting filter', function() {
    var hoursMinutes;

    beforeEach(module('homeTrax.common.filters'));

    beforeEach(inject(function(_hoursMinutesFilter_) {
      hoursMinutes = _hoursMinutesFilter_;
    }));

    it('exists', function() {
      expect(hoursMinutes).to.exit;
    });

    describe('formatting', function() {
      it('formats zero to blank', function() {
        var hrs = hoursMinutes(0);
        expect(hrs).to.equal('');
      });

      it('formats undefined to blank', function() {
        var hrs = hoursMinutes();
        expect(hrs).to.equal('');
      });

      it('formats null to blank', function() {
        var hrs = hoursMinutes(null);
        expect(hrs).to.equal('');
      });

      it('formats one ms to "0:00"', function() {
        var hrs = hoursMinutes(1);
        expect(hrs).to.equal('0:00');
      });

      it('formats less than one minute to "0:00"', function() {
        var hrs = hoursMinutes(59999);
        expect(hrs).to.equal('0:00');
      });

      it('formats one minute to "0:01"', function() {
        var hrs = hoursMinutes(60000);
        expect(hrs).to.equal('0:01');
      });

      it('formats one hour to "1:00"', function() {
        var hrs = hoursMinutes(60000 * 60);
        expect(hrs).to.equal('1:00');
      });

      it('formats one hour and one minute to "1:01"', function() {
        var hrs = hoursMinutes(60000 * 60 + 60000);
        expect(hrs).to.equal('1:01');
      });

      it('formats one hour and eleven minutes to "1:11"', function() {
        var hrs = hoursMinutes((60000 * 60) + (60000 * 11));
        expect(hrs).to.equal('1:11');
      });
    });
  });
}());