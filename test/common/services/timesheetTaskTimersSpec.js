(function() {
  'use strict';

  describe('homeTrax.common.services.timesheetTaskTimers: timesheetTaskTimers', function() {
    var mockFoo;
    var timesheetTaskTimers;

    var testTimesheet;
    var testTaskTimers;

    var config;
    var httpBackend;
    var scope;

    beforeEach(module('homeTrax.common.services.timesheetTaskTimers'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(function() {
      mockFoo = sinon.stub({
        bar: function() {
        }
      });

      module(function($provide) {
        $provide.value('foo', mockFoo);
      });
    });

    beforeEach(inject(function($rootScope, $httpBackend, _timesheetTaskTimers_, _config_) {
      httpBackend = $httpBackend;
      scope = $rootScope;
      timesheetTaskTimers = _timesheetTaskTimers_;
      config = _config_;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('exists', function() {
      expect(timesheetTaskTimers).to.exist;
    });

    describe('load', function() {
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
      });

      it('loads the data for the specified timesheet', function() {
        timesheetTaskTimers.load(testTimesheet);
        httpBackend.flush();
      });

      it('sets all to the results of the load', function(done) {
        timesheetTaskTimers.load(testTimesheet).then(function() {
          expect(timesheetTaskTimers.all.length).to.equal(7);
          done();
        });

        httpBackend.flush();
      });
    });

    describe('get task timers', function() {
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        httpBackend.flush();
      });

      it('returns task timers for the day specified', function() {
        var tt = timesheetTaskTimers.get('2015-10-13');
        expect(tt.length).to.equal(3);
        expect(tt[0]._id).to.equal(12342);
        expect(tt[1]._id).to.equal(12344);
        expect(tt[2]._id).to.equal(12346);
      });
    });

    describe('get total time', function() {
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        httpBackend.flush();
      });

      it('gets the total time for the specified day', function() {
        expect(timesheetTaskTimers.totalTime('2015-10-13')).to.equal(1234000 + 948000 + 672000);
      });

      it('calculates zero if there are no timers for the specified date', function() {
        expect(timesheetTaskTimers.totalTime('2013-01-01')).to.equal(0);
      });

      it('gets the total time for the whole timesheet if no day is specified', function() {
        expect(timesheetTaskTimers.totalTime()).to.equal(
          3884000 + 1234000 + 4885000 + 948000 + 3746000 + 672000 + 123000);
      });
    });

    describe('create new task timer', function() {
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        httpBackend.flush();
      });

      it('references the current timesheet', function() {
        var tt = timesheetTaskTimers.create('2015-10-16');
        expect(tt.timesheetRid).to.equal(testTimesheet._id);
      });

      it('is for the specified work date', function() {
        var tt = timesheetTaskTimers.create('2015-10-16');
        expect(tt.workDate).to.equal('2015-10-16');
      });
    });

    describe('adding a task timer', function() {
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        httpBackend.flush();
      });

      it('adds the specified task timer to the end of the list', function() {
        timesheetTaskTimers.add({
          _id: 320,
          workDate: '2015-10-16'
        });
        expect(timesheetTaskTimers.all.length).to.equal(8);
        expect(timesheetTaskTimers.all[7]).to.deep.equal({
          _id: 320,
          workDate: '2015-10-16'
        });
      });
    });

    function initializeTestData() {
      testTimesheet = {
        _id: 4273314159,
        endDate: '2015-10-17'
      };

      testTaskTimers = [{
        _id: 12341,
        workDate: '2015-10-12',
        milliseconds: 3884000
      }, {
        _id: 12342,
        workDate: '2015-10-13',
        milliseconds: 1234000
      }, {
        _id: 12343,
        workDate: '2015-10-14',
        milliseconds: 4885000
      }, {
        _id: 12344,
        workDate: '2015-10-13',
        milliseconds: 948000
      }, {
        _id: 12345,
        workDate: '2015-10-12',
        milliseconds: 3746000
      }, {
        _id: 12346,
        workDate: '2015-10-13',
        milliseconds: 672000
      }, {
        _id: 12347,
        workDate: '2015-10-15',
        milliseconds: 123000
      }];
    }
  });
}());