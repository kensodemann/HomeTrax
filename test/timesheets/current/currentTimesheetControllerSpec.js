(function() {
  'use strict';

  describe('homeTrax.timesheets.current: currentTimesheetController', function() {
    var mockModalInstance;
    var mockTaskTimer;
    var mockTaskTimerEditor;
    var mockTimesheets;
    var mockTimesheetTaskTimers;
    var $controllerConstructor;

    var getCurrentDfd;
    var loadTaskTimersDfd;
    var modalDfd;

    var EditorMode;
    var $rootScope;

    beforeEach(module('homeTrax.timesheets.current'));

    beforeEach(inject(function($controller, $q, _$rootScope_, _EditorMode_) {
      $controllerConstructor = $controller;
      getCurrentDfd = $q.defer();
      loadTaskTimersDfd = $q.defer();
      modalDfd = $q.defer();
      $rootScope = _$rootScope_;
      EditorMode = _EditorMode_;
    }));

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

    beforeEach(function() {
      mockTimesheetTaskTimers = sinon.stub({
        load: function() {
        },

        get: function() {
        },

        totalTime: function() {
        },

        create: function() {
        },

        add: function() {
        }
      });
      mockTimesheetTaskTimers.load.returns(loadTaskTimersDfd.promise);
      mockTimesheetTaskTimers.create.returns(mockTaskTimer);
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
        taskTimerEditor: mockTaskTimerEditor,
        timesheetTaskTimers: mockTimesheetTaskTimers
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

      it('assigns the resolved current timesheet', function() {
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
        expect(mockTimesheetTaskTimers.load.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.load.calledWith({
          _id: 1,
          endDate: '2015-10-17'
        })).to.be.true;
      });

      it('sets the controller ready after both the current timesheet and its timers are loaded', function() {
        var controller = createController();
        expect(controller.isReady).to.be.false;
        resolveCurrentTimesheet();
        expect(controller.isReady).to.be.false;
        resolveTaskTimerLoad();
        expect(controller.isReady).to.be.true;
      });

      it('initializes the timers and total for today', function() {
        createController();
        resolveCurrentTimesheet();
        resolveTaskTimerLoad();
        expect(mockTimesheetTaskTimers.get.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.get.calledWith('2015-10-14')).to.be.true;
        expect(mockTimesheetTaskTimers.totalTime.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.totalTime.calledWith('2015-10-14')).to.be.true;
      });
    });

    describe('selecting a new date', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        resolveCurrentTimesheet();
        resolveTaskTimerLoad();
        mockTimesheetTaskTimers.get.reset();
        mockTimesheetTaskTimers.totalTime.reset();
      });

      it('sets the current date', function() {
        controller.selectDate(2);
        expect(controller.currentDate).to.equal('2015-10-13');
      });

      it('selects the timesheets for that day', function() {
        controller.selectDate(2);
        expect(mockTimesheetTaskTimers.get.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.get.calledWith('2015-10-13')).to.be.true;
      });

      it('calculates the total time for that day', function() {
        controller.selectDate(2);
        expect(mockTimesheetTaskTimers.totalTime.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.totalTime.calledWith('2015-10-13')).to.be.true;
      });
    });

    describe('creating a new timer', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        resolveCurrentTimesheet({
          _id: 314159
        });
        resolveTaskTimerLoad();
        mockTimesheetTaskTimers.get.reset();
        mockTimesheetTaskTimers.totalTime.reset();
      });

      it('instantiates a new timer with the current date', function() {
        controller.newTimer();
        expect(mockTimesheetTaskTimers.create.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.create.calledWith('2015-10-14')).to.be.true;
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
        resolveModal(tt);
        expect(mockTimesheetTaskTimers.add.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.add.calledWith(tt)).to.be.true;
      });

      it('refreshes the task timers for today', function() {
        controller.newTimer();
        resolveModal({});
        expect(mockTimesheetTaskTimers.get.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.get.calledWith('2015-10-14')).to.be.true;
      });

      it('recalculates the total time for today', function() {
        controller.newTimer();
        resolveModal({});
        expect(mockTimesheetTaskTimers.totalTime.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.totalTime.calledWith('2015-10-14')).to.be.true;
      });
    });

    describe('editing an existing timer', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        resolveCurrentTimesheet();
        resolveTaskTimerLoad();
        controller.allTaskTimers = [{
          _id: 1,
          name: 'taskTimerOne'
        }, {
          _id: 3,
          name: 'taskTimerThree'
        }, {
          _id: 2,
          name: 'taskTimerTwo'
        }]
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

    function resolveTaskTimerLoad() {
      loadTaskTimersDfd.resolve();
      $rootScope.$digest();
    }

    function resolveModal(taskTimer) {
      modalDfd.resolve(taskTimer);
      $rootScope.$digest();
    }
  });
}());
