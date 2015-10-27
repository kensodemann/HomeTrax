(function() {
  'use strict';

  describe('homeTrax.timesheets.current: currentTimesheetController', function() {
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
      mockTimesheets = sinon.stub({
        getCurrent: function() {}
      });
      mockTimesheets.getCurrent.returns(getCurrentDfd.promise);
    });

    function createController() {
      return $controllerConstructor('currentTimesheetController', {
        timesheets: mockTimesheets
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
    });
  });
}());
