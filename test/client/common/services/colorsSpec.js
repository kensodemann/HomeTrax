/* global beforeEach describe expect inject it */
(function() {
  'use strict';

  describe('colors service', function() {
    var mockIdentity;

    var serviceUnderTest;

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

    beforeEach(inject(function(colors) {
      serviceUnderTest = colors;
    }));

    it('exists', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    describe('getColor', function() {
      describe('user colors behavior', function() {
        it('returns proper value for calendar events', function() {
          var c = serviceUnderTest.getColor(serviceUnderTest.calendar);
          expect(c).to.equal('#111111');
        });
        
        it('returns proper value for appointment events', function() {
          var c = serviceUnderTest.getColor(serviceUnderTest.appointment);
          expect(c).to.equal('#222222');
        });
        
        it('returns proper value for task events', function() {
          var c = serviceUnderTest.getColor(serviceUnderTest.task);
          expect(c).to.equal('#333333');
        });
        
        it('returns proper value for anniversary events', function() {
          var c = serviceUnderTest.getColor(serviceUnderTest.anniversary);
          expect(c).to.equal('#444444');
        });
      });
      
      describe('system colors behavior', function() {
        it('returns proper value for calendar events', function() {
          var c = serviceUnderTest.getColor(serviceUnderTest.calendar, true);
          expect(c).to.equal('#111111');
        });
        
        it('returns proper value for appointment events', function() {
          var c = serviceUnderTest.getColor(serviceUnderTest.appointment, true);
          expect(c).to.equal('#990033');
        });
        
        it('returns proper value for task events', function() {
          var c = serviceUnderTest.getColor(serviceUnderTest.task, true);
          expect(c).to.equal('#669933');
        });
        
        it('returns proper value for anniversary events', function() {
          var c = serviceUnderTest.getColor(serviceUnderTest.anniversary, true);
          expect(c).to.equal('#9933FF');
        });
      });
    });
  });
})();