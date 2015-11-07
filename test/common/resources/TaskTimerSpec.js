(function() {
  'use strict';

  describe('homeTrax.common.resources: TaskTimer', function() {
    var config;
    var httpBackend;
    var scope;
    var testData;
    var TaskTimer;

    beforeEach(module('homeTrax.common.resources'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($rootScope, $httpBackend, _TaskTimer_, _config_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      TaskTimer = _TaskTimer_;
      config = _config_;
    }));

    it('exists', function() {
      expect(TaskTimer).to.exist;
    });

    describe('query', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/timesheets/42/taskTimers')
          .respond(testData);
        res = TaskTimer.query({
          timesheetRid: 42
        });
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.length).to.equal(6);
        expect(res[0]._id).to.equal(1);
        expect(res[2]._id).to.equal(3);
        expect(res[4]._id).to.equal(4);
      });
    });

    describe('get', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/timesheets/42/taskTimers/2')
          .respond(testData[1]);
        res = TaskTimer.get({
          timesheetRid: 42,
          id: 2
        });
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.workDate).to.equal('2015-10-02');
      });
    });

    describe('POST', function() {
      it('saves new data properly', function() {
        httpBackend.expectPOST(config.dataService + '/timesheets/73/taskTimers')
          .respond({});
        var res = TaskTimer.save({
          workDate: '2015-12-25',
          name: 'Deliver Gifts',
          timesheetRid: 73
        });
        httpBackend.flush();
      });

      it('saves existing data properly', function() {
        httpBackend.expectPOST(config.dataService + '/timesheets/42/taskTimers/2')
          .respond({});
        var res = TaskTimer.save(testData[1]);
        httpBackend.flush();
      });
    });

    function initializeTestData() {
      testData = [{
        _id: 1,
        name: 'Timesheet Resources',
        workDate: '2015-10-01',
        timesheetRid: 42
      }, {
        _id: 2,
        name: 'Timesheet Resources',
        workDate: '2015-10-02',
        timesheetRid: 42
      }, {
        _id: 3,
        name: 'Project Resources',
        workDate: '2015-10-02',
        timesheetRid: 73
      }, {
        _id: 6,
        name: 'Project Resources',
        workDate: '2015-10-03',
        timesheetRid: 42
      }, {
        _id: 4,
        name: 'Timesheet Resources',
        workDate: '2015-10-03',
        timesheetRid: 73
      }, {
        _id: 5,
        name: 'Timesheet Resources',
        workDate: '2015-10-04',
        timesheetRid: 314159
      }];
    }
  });
}());
