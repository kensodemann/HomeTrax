(function() {
  'use strict';

  describe('homeTrax.timesheets.current: currentTimesheetController', function() {
    var mockTimesheet;
    var mockTimesheetConstructor;
    var $controllerConstructor;

    beforeEach(module('homeTrax.timesheets.current'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    beforeEach(function() {
      mockTimesheetConstructor = sinon.stub();
      mockTimesheet = sinon.stub({
        $save: function() {}
      });
      mockTimesheetConstructor.returns(mockTimesheet);
      mockTimesheetConstructor.query = sinon.stub();
    });

    function createController() {
      return $controllerConstructor('currentTimesheetController', {
        Timesheet: mockTimesheetConstructor
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

      it('attempts to get the current timesheet', function() {
        createController();
        expect(mockTimesheetConstructor.query.calledOnce).to.be.true;
        expect(mockTimesheetConstructor.query.calledWith({
          endDate: '2015-10-17'
        })).to.be.true;
      });

      it('creates a new timesheet if no timesheet is returned', function() {
        var controller = createController();
        mockTimesheetConstructor.query.yield([]);
        expect(mockTimesheetConstructor.calledOnce).to.be.true;
        expect(mockTimesheetConstructor.calledWith({
          endDate: '2015-10-17'
        })).to.be.true;
        expect(controller.timesheet).to.equal(mockTimesheet);
      });
    });
  });
}());
