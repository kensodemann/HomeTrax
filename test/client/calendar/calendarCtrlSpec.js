/* global beforeEach describe expect inject it moment sinon */
(function() {
  'use strict';

  describe('calendarCtrl', function() {
    beforeEach(module('app.calendar'));

    var askDfd;
    var loadDfd;

    var scope;
    var $controllerConstructor;

    var mockAside;
    var mockAsideConstructor;
    var mockCalendar;
    var mockCalendarData;
    var mockCalendarEventEditor;
    var mockPromise;
    var testEvent;

    beforeEach(inject(function($controller, $rootScope, $q) {
      scope = $rootScope.$new();
      $controllerConstructor = $controller;
      loadDfd = $q.defer();
      askDfd = $q.defer();
    }));

    beforeEach(function() {
      buildMockCalendar();
      buildMockCalendarData();
      buildMockEventEditor();
      buildMockPromise();
      buildMockAside();

      function buildMockCalendar() {
        mockCalendar = sinon.stub({
          fullCalendar: function() {}
        });
        scope.calendar = mockCalendar;
      }

      function buildMockCalendarData() {
        testEvent = {
          start: moment('2014-05-13T08:00:00'),
          end: moment('2014-05-13T10:00:00')
        };

        mockCalendarData = sinon.stub({
          load: function() {},
          events: function() {},
          eventCategories: function() {},
          newEvent: function() {},
          limitToMine: function() {},
          excludeCategory: function() {},
          includeCategory: function() {}
        });
        mockCalendarData.load.returns(loadDfd.promise);
        mockCalendarData.events.returns([]);
        mockCalendarData.eventCategories.returns([
          1, 2, 3, 4, 5, 6, 7
        ]);
        mockCalendarData.newEvent.returns(testEvent);
      }

      function buildMockEventEditor() {
        mockCalendarEventEditor = sinon.stub({
          initialize: function() {},
          open: function() {}
        });
      }

      function buildMockAside() {
        mockAside = sinon.stub({
          hide: function() {},
          show: function() {},
          $promise: mockPromise
        });

        mockAsideConstructor = sinon.stub().returns(mockAside);
        mockAsideConstructor.open = sinon.stub();
      }

      function buildMockPromise() {
        mockPromise = sinon.stub({
          then: function() {}
        });
      }
    });

    function createController() {
      return $controllerConstructor('calendarCtrl', {
        $scope: scope,
        $aside: mockAsideConstructor,
        calendarData: mockCalendarData,
        calendarEventEditor: mockCalendarEventEditor
      });
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.not.be.undefined;
    });

    describe('Instantiation', function() {
      it('loads the events', function() {
        var ctrl = createController();
        var loadedEvents;

        ctrl.eventSources[0].events(moment(), moment(), 'local', function(evts) {
          loadedEvents = evts;
        });

        expect(mockCalendarData.load.calledOnce).to.be.true;
        loadDfd.resolve(true);
        scope.$digest();
        expect(mockCalendarData.events.calledOnce).to.be.true;
      });

      it('loads the event categories', function() {
        var ctrl = createController();
        var aside = getAside();
        var loadedEvents;

        ctrl.eventSources[0].events(moment(), moment(), 'local', function(evts) {
          loadedEvents = evts;
        });

        loadDfd.resolve(true);
        scope.$digest();
        expect(mockCalendarData.eventCategories.calledOnce).to.be.true;
        expect(aside.eventCategories.length).to.equal(7);
      });
    });

    describe('Adding a new event', function() {
      it('initializes the event editor service', function() {
        var ctrl = createController();

        ctrl.uiConfig.calendar.dayClick(moment());

        expect(mockCalendarEventEditor.initialize.calledOnce).to.be.true;
        expect(mockCalendarEventEditor.initialize.calledWith(mockCalendar)).to.be.true;
      });

      it('creates a new event for the day', function() {
        var day = moment();
        var ctrl = createController();

        ctrl.uiConfig.calendar.dayClick(day);

        expect(mockCalendarData.newEvent.calledOnce).to.be.true;
        expect(mockCalendarData.newEvent.calledWith(day)).to.be.true;
      });

      it('opens the event editor passing the new event', function() {
        var ctrl = createController();
        ctrl.uiConfig.calendar.dayClick(moment());
        expect(mockCalendarEventEditor.open.calledOnce).to.be.true;
        expect(mockCalendarEventEditor.open.calledWith(testEvent)).to.be.true;
      });
    });

    describe('Editing an Event', function() {
      it('initializes the event editor service', function() {
        var ctrl = createController();

        var eventToEdit = {
          _id: 42,
          title: 'The answer to life the universe and everything',
          start: moment(),
          end: moment()
        };
        ctrl.uiConfig.calendar.eventClick(eventToEdit);

        expect(mockCalendarEventEditor.initialize.calledOnce).to.be.true;
        expect(mockCalendarEventEditor.initialize.calledWith(mockCalendar)).to.be.true;
      });

      it('opens the event editor passing the clicked event', function() {
        var ctrl = createController();
        var eventToEdit = {
          _id: 42,
          title: 'The answer to life the universe and everything',
          start: moment(),
          end: moment()
        };
        ctrl.uiConfig.calendar.eventClick(eventToEdit);
        expect(mockCalendarEventEditor.open.calledOnce).to.be.true;
        expect(mockCalendarEventEditor.open.calledWith(eventToEdit)).to.be.true;
      });
    });

    describe('drag-n-dropping an event', function() {
      it('saves the event', function() {
        var mockEvent = sinon.stub({
          $save: function() {}
        });
        var ctrl = createController();
        ctrl.uiConfig.calendar.eventDrop(mockEvent);
        expect(mockEvent.$save.calledOnce).to.be.true;
      });
    });
    
    describe('resizing an event', function() {
      it('saves the event', function() {
        var mockEvent = sinon.stub({
          $save: function() {}
        });
        var ctrl = createController();
        ctrl.uiConfig.calendar.eventResize(mockEvent);
        expect(mockEvent.$save.calledOnce).to.be.true;
      });
    });

    describe('limiting to my events', function() {
      beforeEach(function() {
        createController();
        loadDfd.resolve(true);
        scope.$digest();
      });

      it('calls limitToMine when checked', function() {
        var aside = getAside();
        aside.showOnlyMine = true;
        aside.$digest();
        expect(mockCalendarData.limitToMine.called).to.be.true;
        expect(mockCalendarData.limitToMine.calledWith(true)).to.be.true;
      });

      it('calls limitToMine when unchecked', function() {
        var aside = getAside();
        aside.showOnlyMine = false;
        aside.$digest();
        expect(mockCalendarData.limitToMine.calledOnce).to.be.true;
        expect(mockCalendarData.limitToMine.calledWith(false)).to.be.true;
      });

      it('refetches events if checked', function() {
        var aside = getAside();
        aside.showOnlyMine = true;
        aside.$digest();
        expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
        expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
      });

      it('refetches events if unchecked', function() {
        var aside = getAside();
        aside.showOnlyMine = false;
        aside.$digest();
        expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
        expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
      });
    });

    describe('Event Category Clicked', function() {
      var aside;
      beforeEach(function() {
        createController();
        aside = getAside();
      });

      it('includes category if include is true', function() {
        aside.categoryChanged({
          name: 'test category',
          include: true
        });
        expect(mockCalendarData.includeCategory.calledOnce).to.be.true;
        expect(mockCalendarData.excludeCategory.called).to.be.false;
        expect(mockCalendarData.includeCategory.calledWith('test category')).to.be.true;
      });

      it('excludes category if include is false', function() {
        aside.categoryChanged({
          name: 'test category',
          include: false
        });
        expect(mockCalendarData.includeCategory.called).to.be.false;
        expect(mockCalendarData.excludeCategory.calledOnce).to.be.true;
        expect(mockCalendarData.excludeCategory.calledWith('test category')).to.be.true;
      });

      it('calls refetchEvents', function() {
        aside.categoryChanged({
          name: 'test category',
          include: false
        });
        expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
      });
    });

    function getAside() {
      return mockAsideConstructor.getCall(0).args[0].scope;
    }
  });
}());