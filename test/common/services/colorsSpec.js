(function() {
  'use strict';

  describe('colors service', function() {
    var mockIdentity;

    var colors;

    beforeEach(module('app.core'));

    beforeEach(function() {
      buildMockIdentity();

      module(function($provide) {
        $provide.value('identity', mockIdentity);
      });

      function buildMockIdentity() {
        mockIdentity = {
          currentUser: {
            _id: "42",
            colors: ['#111111', '#222222', '#333333', '#444444']
          }
        };
      }
    });

    beforeEach(inject(function(_colors_) {
      colors = _colors_;
    }));

    it('exists', function() {
      expect(colors).to.exist;
    });

    describe('getColor', function() {
      describe('user colors behavior', function() {
        it('returns proper value for calendar events', function() {
          var c = colors.getColor(colors.calendar);
          expect(c).to.equal('#111111');
        });
        
        it('returns proper value for appointment events', function() {
          var c = colors.getColor(colors.appointment);
          expect(c).to.equal('#222222');
        });
        
        it('returns proper value for task events', function() {
          var c = colors.getColor(colors.task);
          expect(c).to.equal('#333333');
        });
        
        it('returns proper value for anniversary events', function() {
          var c = colors.getColor(colors.anniversary);
          expect(c).to.equal('#444444');
        });
      });
      
      describe('system colors behavior', function() {
        it('returns proper value for calendar events', function() {
          var c = colors.getColor(colors.calendar, true);
          expect(c).to.equal('#111111');
        });
        
        it('returns proper value for appointment events', function() {
          var c = colors.getColor(colors.appointment, true);
          expect(c).to.equal('#990033');
        });
        
        it('returns proper value for task events', function() {
          var c = colors.getColor(colors.task, true);
          expect(c).to.equal('#669933');
        });
        
        it('returns proper value for anniversary events', function() {
          var c = colors.getColor(colors.anniversary, true);
          expect(c).to.equal('#9933FF');
        });
      });
    });
  });
})();