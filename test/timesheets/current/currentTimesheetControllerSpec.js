(function() {
  'use strict';

  describe('homeTrax.timesheets.current: currentTimesheetController', function() {
    var mockTaskTimer;
    var mockTimesheets;
    var $controllerConstructor;

    var getCurrentDfd;
    var $rootScope;

    beforeEach(module('homeTrax.timesheets.current'));

    beforeEach(inject(function($controller, $q, _$rootScope_) {
      $controllerConstructor = $controller;
      getCurrentDfd = $q.defer();
      $rootScope = _$rootScope_;
    }));

    beforeEach(function() {
      mockTaskTimer = sinon.stub({
        query: function() {}
      });
    });

    beforeEach(function() {
      mockTimesheets = sinon.stub({
        getCurrent: function() {}
      });
      mockTimesheets.getCurrent.returns(getCurrentDfd.promise);
    });

    function createController() {
      return $controllerConstructor('currentTimesheetController', {
        timesheets: mockTimesheets,
        TaskTimer: mockTaskTimer
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activation', function() {
      var clock;
      beforeEach(function() {
        var dt = new Date(2015, 9, 14);
        clock = sinon.useFakeTimers(dt.getTime());
      });

      afterEach(function() {
        clock.restore();
      });

      it('gets the current timesheet', function() {
        createController();
        expect(mockTimesheets.getCurrent.calledOnce).to.be.true;
      });

      it('assigns the resolved current period', function() {
        var controller = createController();
        getCurrentDfd.resolve({
          _id: 1,
          endDate: '2015-10-15'
        });
        $rootScope.$digest();
        expect(controller.timesheet).to.deep.equal({
          _id: 1,
          endDate: '2015-10-15'
        });
      });

      it('gets all of the task timers for the current timesheet', function() {
        var controller = createController();
        getCurrentDfd.resolve({
          _id: 1,
          endDate: '2015-10-15'
        });
        $rootScope.$digest();
        expect(mockTaskTimer.query.calledOnce).to.be.true;
        expect(mockTaskTimer.query.calledWith({
          timesheetRid: 1
        })).to.be.true;
      });
    });
  });
}());
