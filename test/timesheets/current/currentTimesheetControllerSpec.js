(function() {
  'use strict';

  describe('homeTrax.timesheets.current: currentTimesheetController', function() {
    var mockModalInstance;
    var mockTaskTimer;
    var mockTaskTimerCollection;
    var mockTaskTimerEditor;
    var mockTimesheets;
    var $controllerConstructor;

    var getCurrentDfd;
    var modalDfd;
    var EditorMode;
    var $rootScope;

    beforeEach(module('homeTrax.timesheets.current'));

    beforeEach(inject(function($controller, $q, _$rootScope_, _EditorMode_) {
      $controllerConstructor = $controller;
      getCurrentDfd = $q.defer();
      modalDfd = $q.defer();
      $rootScope = _$rootScope_;
      EditorMode = _EditorMode_;
    }));

    beforeEach(function() {
      mockTaskTimer = {};
      mockTaskTimerCollection = sinon.stub();
      mockTaskTimerCollection.returns(mockTaskTimer);
      mockTaskTimerCollection.query = sinon.stub();
    });

    beforeEach(function() {
      mockModalInstance = {
        result: modalDfd.promise
      };
    });

    beforeEach(function() {
      mockTaskTimerEditor = sinon.stub({
        open: function() {}
      });
      mockTaskTimerEditor.open.returns(mockModalInstance);
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
        TaskTimer: mockTaskTimerCollection,
        taskTimerEditor: mockTaskTimerEditor
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
        expect(mockTaskTimerCollection.query.calledOnce).to.be.true;
        expect(mockTaskTimerCollection.query.calledWith({
          timesheetRid: 1
        })).to.be.true;
      });
    });

    describe('creating a new timer', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        controller.timesheet = {
          _id: 314159,
          endDate: '2015-11-07'
        };
        controller.dates = [{
          isoDateString: '2015-11-01'
        }, {
          isoDateString: '2015-11-02'
        }, {
          isoDateString: '2015-11-03'
        }, {
          isoDateString: '2015-11-04',
          active: true
        }, {
          isoDateString: '2015-11-05'
        }, {
          isoDateString: '2015-11-06'
        }, {
          isoDateString: '2015-11-07'
        }];
      });

      it('instantiates a new timer with the current date', function() {
        controller.newTimer();
        expect(mockTaskTimerCollection.calledOnce).to.be.true;
        expect(mockTaskTimerCollection.calledWith({
          workDate: '2015-11-04',
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
          name: 'Douglas Adams'
        };
        controller.newTimer();
        expect(controller.taskTimers.length).to.equal(0);
        modalDfd.resolve(tt);
        $rootScope.$digest();
        expect(controller.taskTimers.length).to.equal(1);
        expect(controller.taskTimers[0]).to.equal(tt);
      });
    });

    describe('editing an existing timeer', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        controller.timesheet = {
          _id: 314159,
          endDate: '2015-11-07'
        };
        controller.taskTimers = [{
          _id: 1,
          name: 'task timer 1'
        }, {
          _id: 2,
          name: 'task timer 2'
        }];
      });

      it('opens the task timer editor', function() {
        controller.editTimer(controller.taskTimers[1]);
        expect(mockTaskTimerEditor.open.calledOnce).to.be.true;
        expect(mockTaskTimerEditor.open.calledWith(controller.taskTimers[1], EditorMode.edit)).to.be.true;
      });
    });
  });
}());
