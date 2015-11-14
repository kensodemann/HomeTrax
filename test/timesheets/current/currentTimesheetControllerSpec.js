(function() {
  'use strict';

  describe('homeTrax.timesheets.current: currentTimesheetController', function() {
    var mockModalInstance;
    var mockTaskTimer;
    var mockTaskTimerConstructor;
    var mockTaskTimerEditor;
    var mockTimesheets;
    var $controllerConstructor;

    var getCurrentDfd;
    var modalDfd;

    var EditorMode;
    var $rootScope;

    var testTaskTimers;

    beforeEach(module('homeTrax.timesheets.current'));

    beforeEach(inject(function($controller, $q, _$rootScope_, _EditorMode_) {
      $controllerConstructor = $controller;
      getCurrentDfd = $q.defer();
      modalDfd = $q.defer();
      $rootScope = _$rootScope_;
      EditorMode = _EditorMode_;
    }));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(function() {
      mockTaskTimer = {};
      mockTaskTimerConstructor = sinon.stub();
      mockTaskTimerConstructor.returns(mockTaskTimer);
      mockTaskTimerConstructor.query = sinon.stub();
      mockTaskTimerConstructor.query.returns(testTaskTimers);
    });

    beforeEach(function() {
      mockModalInstance = {
        result: modalDfd.promise
      };
    });

    beforeEach(function() {
      mockTaskTimerEditor = sinon.stub({
        open: function() {
        }
      });
      mockTaskTimerEditor.open.returns(mockModalInstance);
    });

    beforeEach(function() {
      mockTimesheets = sinon.stub({
        getCurrent: function() {
        }
      });
      mockTimesheets.getCurrent.returns(getCurrentDfd.promise);
    });

    var clock;
    beforeEach(function() {
      var dt = new Date(2015, 9, 14);
      clock = sinon.useFakeTimers(dt.getTime());
    });

    afterEach(function() {
      clock.restore();
    });

    function createController() {
      return $controllerConstructor('currentTimesheetController', {
        timesheets: mockTimesheets,
        TaskTimer: mockTaskTimerConstructor,
        taskTimerEditor: mockTaskTimerEditor
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activation', function() {
      it('sets a flag that the controller is not ready yet', function() {
        var controller = createController();
        expect(controller.isReady).to.be.false;
      });

      it('gets the current timesheet', function() {
        createController();
        expect(mockTimesheets.getCurrent.calledOnce).to.be.true;
      });

      it('sets the current date to today', function() {
        var controller = createController();
        expect(controller.currentDate).to.equal('2015-10-14');
      });

      it('gets the week dates associated with the current date', function() {
        var controller = createController();
        expect(controller.dates.length).to.equal(7);
        expect(controller.dates[0].isoDateString).to.equal('2015-10-11');
        expect(controller.dates[3].isoDateString).to.equal('2015-10-14');
        expect(controller.dates[6].isoDateString).to.equal('2015-10-17');
      });

      it('sets the current date active', function() {
        var controller = createController();
        expect(controller.dates[3].active).to.be.true;
        expect(controller.dates[2].active).to.be.false;
        expect(controller.dates[4].active).to.be.false;
      });

      it('assigns the resolved current period', function() {
        var controller = createController();
        resolveCurrentTimesheet({
          _id: 1,
          endDate: '2015-10-17'
        });
        expect(controller.timesheet).to.deep.equal({
          _id: 1,
          endDate: '2015-10-17'
        });
      });

      it('gets all of the task timers for the current timesheet', function() {
        createController();
        resolveCurrentTimesheet({
          _id: 1,
          endDate: '2015-10-17'
        });
        expect(mockTaskTimerConstructor.query.calledOnce).to.be.true;
        expect(mockTaskTimerConstructor.query.calledWith({
          timesheetRid: 1
        })).to.be.true;
      });

      it('sets the controller ready after both the current timesheet and its timers are loaded', function() {
        var controller = createController();
        expect(controller.isReady).to.be.false;
        resolveCurrentTimesheet();
        expect(controller.isReady).to.be.false;
        resolveTasksQuery();
        expect(controller.isReady).to.be.true;
      });

      it('initializes the timers and total for today', function() {
        var controller = createController();
        resolveCurrentTimesheet();
        resolveTasksQuery();
        expect(controller.taskTimers.length).to.equal(1);
        expect(controller.taskTimers[0].workDate).to.equal('2015-10-14');
        expect(controller.totalTime).to.equal(4885000);
      });
    });

    describe('selecting a new date', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        resolveCurrentTimesheet();
        resolveTasksQuery();
      });

      it('sets the current date', function() {
        controller.selectDate(2);
        expect(controller.currentDate).to.equal('2015-10-13');
      });

      it('selects the timesheets for that day', function() {
        controller.selectDate(2);
        expect(controller.taskTimers.length).to.equal(3);
        expect(controller.taskTimers[0]._id).to.equal(12342);
        expect(controller.taskTimers[1]._id).to.equal(12344);
        expect(controller.taskTimers[2]._id).to.equal(12346);
      });

      it('calculates the total time for that day', function() {
        controller.selectDate(2);
        expect(controller.totalTime).to.equal(1234000 + 948000 + 672000);
      });

      it('calculates a total time of zero if there are no timers for that day', function() {
        controller.selectDate(0);
        expect(controller.totalTime).to.equal(0);
      });
    });

    describe('creating a new timer', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        resolveCurrentTimesheet({
          _id: 314159
        });
        resolveTasksQuery();
      });

      it('instantiates a new timer with the current date', function() {
        controller.newTimer();
        expect(mockTaskTimerConstructor.calledOnce).to.be.true;
        expect(mockTaskTimerConstructor.calledWith({
          workDate: '2015-10-14',
          timesheetRid: 314159
        })).to.be.true;
      });

      it('opens the task timer editor', function() {
        controller.newTimer();
        expect(mockTaskTimerEditor.open.calledOnce).to.be.true;
        expect(mockTaskTimerEditor.open.calledWith(mockTaskTimer, EditorMode.create)).to.be.true;
      });

      it('pushes the new task timer to the list if it was saved properly', function() {
        var tt = {
          _id: 42,
          workDate: '2015-10-14',
          timesheetRid: 314159,
          name: 'Douglas Adams'
        };
        controller.newTimer();
        expect(controller.allTaskTimers.length).to.equal(7);
        resolveModal(tt);
        expect(controller.allTaskTimers.length).to.equal(8);
        expect(controller.allTaskTimers[7]).to.equal(tt);
      });

      it('refreshes the task timers for today', function() {
        var tt = {
          _id: 42,
          name: 'Douglas Adams',
          workDate: '2015-10-14',
          timesheetRid: 314159,
          milliseconds: 1500
        };
        controller.newTimer();
        expect(controller.taskTimers.length).to.equal(1);
        resolveModal(tt);
        expect(controller.taskTimers.length).to.equal(2);
        expect(controller.taskTimers[1]).to.equal(tt);
      });

      it('recalculates the total time for today', function() {
        var tt = {
          _id: 42,
          name: 'Douglas Adams',
          workDate: '2015-10-14',
          timesheetRid: 314159,
          milliseconds: 1500
        };
        controller.newTimer();
        expect(controller.totalTime).to.equal(4885000);
        resolveModal(tt);
        expect(controller.totalTime).to.equal(4885000 + 1500);
      });
    });

    describe('editing an existing timer', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        resolveCurrentTimesheet();
        resolveTasksQuery();
      });

      it('opens the task timer editor', function() {
        controller.editTimer(controller.allTaskTimers[1]);
        expect(mockTaskTimerEditor.open.calledOnce).to.be.true;
        expect(mockTaskTimerEditor.open.calledWith(controller.allTaskTimers[1], EditorMode.edit)).to.be.true;
      });
    });

    function resolveCurrentTimesheet(ts) {
      getCurrentDfd.resolve(ts || {_id: 123});
      $rootScope.$digest();
    }

    function resolveTasksQuery() {
      mockTaskTimerConstructor.query.yield();
      $rootScope.$digest();
    }

    function resolveModal(taskTimer) {
      modalDfd.resolve(taskTimer);
      $rootScope.$digest();
    }

    function initializeTestData() {
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
