'use strict';

describe('calendarCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var q;

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
    q = $q;
  }));

  it('exists', function() {
    var ctrl = $controllerConstructor('calendarCtrl', {
      $scope: scope,
      $modal: {}
    });

    expect(ctrl).to.not.be.undefined;
  });

  describe('initialization', function() {
    var mockCalendarData;
    var dfd;

    beforeEach(function() {
      mockCalendarData = sinon.stub({
        load: function() {
        },
        events: function() {
        }
      });
      dfd = q.defer();
      mockCalendarData.load.returns(dfd.promise);
      mockCalendarData.events.returns([]);
    });

    it('loads the events', function() {
      $controllerConstructor('calendarCtrl', {
        $scope: scope,
        $modal: {},
        calendarData: mockCalendarData
      });

      expect(mockCalendarData.load.calledOnce).to.be.true;
      dfd.resolve(true);
      scope.$digest();
      expect(mockCalendarData.events.calledOnce).to.be.true;
    });
  });

  describe('Editing an Event', function() {
    var mockCalendarData;
    var mockModal;
    var mockModalInstance;
    var mockCalendar;
    var dfd;

    beforeEach(function() {
      mockCalendar = sinon.stub({
        fullCalendar: function() {
        }
      });
      scope.calendar = mockCalendar;

      dfd = q.defer();
      mockModal = sinon.stub({
        open: function() {
        }
      });
      mockModalInstance = sinon.stub({
        result: dfd.promise
      });
      mockModal.open.returns(mockModalInstance);

      mockCalendarData = sinon.stub({
        load: function() {
        },
        events: function() {
        }
      });
      mockCalendarData.events.returns([
        {
          _id: 1,
          title: 'event 1'
        },
        {
          _id: 2,
          title: 'event 2'
        },
        {
          _id: 3,
          title: 'event 3'
        },
        {
          _id: 4,
          title: 'event 4'
        }
      ]);
    });

    function createController() {
      var queryDfd = q.defer();
      mockCalendarData.load.returns(queryDfd.promise);

      $controllerConstructor('calendarCtrl', {
        $scope: scope,
        $modal: mockModal,
        calendarData: mockCalendarData
      });

      queryDfd.resolve(true);
      scope.$digest();
    }

    it('Opens the modal', function() {
      createController();

      scope.eventClicked({
        _id: 2,
        title: 'event 2'
      });

      expect(mockModal.open.calledOnce).to.be.true;
    });

    it('replaces the modified event when closed with save', function() {
      createController();

      scope.eventClicked({
        _id: 2,
        title: 'event 2'
      });
      var modifiedEvent = {
        _id: 2,
        title: 'event 2 modified'
      };
      dfd.resolve(modifiedEvent);
      scope.$digest();

      expect(scope.events.length).to.equal(4);
      expect($.inArray(modifiedEvent, scope.events)).to.not.equal(-1);
    });

    it('removes the event when closed with remove', function() {
      createController();

      scope.eventClicked({
        _id: 2,
        title: 'event 2'
      });
      dfd.resolve(true);
      scope.$digest();

      expect(scope.events.length).to.equal(3);
      expect($.grep(scope.events, function(e) {
        return e._id === 2;
      }).length).to.equal(0);
    });

    it('renders te calendar', function() {
      createController();

      scope.eventClicked({
        _id: 2,
        title: 'event 2'
      });
      var modifiedEvent = {
        _id: 2,
        title: 'event 2'
      };
      dfd.resolve(modifiedEvent);
      scope.$digest();

      expect(mockCalendar.fullCalendar.calledWith('render')).to.be.true;
    });

    // Experimentation shows that if the allDay flag is toggled or the title is
    // changed, then the event needs to be removed from the calendar first to
    // prevent doubling up.
    it('does not remove the event from the calendar if allDay not changed and title not changed', function() {
      mockCalendarData.events.returns([
        {
          _id: 1,
          title: 'event 1'
        },
        {
          _id: 2,
          title: 'event 2',
          category: 'Test',
          allDay: true
        },
        {
          _id: 3,
          title: 'event 3'
        },
        {
          _id: 4,
          title: 'event 4'
        }
      ]);

      var eventToModify = {
        _id: 2,
        title: 'event 2',
        category: 'Test',
        allDay: true
      };

      createController();

      scope.eventClicked(eventToModify);
      eventToModify.category = 'Holiday';
      dfd.resolve(eventToModify);
      scope.$digest();

      expect(mockCalendar.fullCalendar.calledWith('removeEvents')).to.be.false;
    });

    it('removes the event from the calendar if allDay changed to not allDay', function() {
      mockCalendarData.events.returns([
        {
          _id: 1,
          title: 'event 1'
        },
        {
          _id: 2,
          title: 'event 2',
          category: 'Test',
          allDay: true
        },
        {
          _id: 3,
          title: 'event 3'
        },
        {
          _id: 4,
          title: 'event 4'
        }
      ]);

      var eventToModify = {
        _id: 2,
        title: 'event 2',
        category: 'Test',
        allDay: true
      };

      createController();

      scope.eventClicked(eventToModify);
      eventToModify.allDay = false;
      dfd.resolve(eventToModify);
      scope.$digest();

      expect(mockCalendar.fullCalendar.calledWith('removeEvents', 2)).to.be.true;
    });

    it('removes the event from the calendar if not allDay changed to allDay', function() {
      mockCalendarData.events.returns([
        {
          _id: 1,
          title: 'event 1'
        },
        {
          _id: 2,
          title: 'event 2',
          category: 'Test',
          allDay: false
        },
        {
          _id: 3,
          title: 'event 3'
        },
        {
          _id: 4,
          title: 'event 4'
        }
      ]);

      var eventToModify = {
        _id: 2,
        title: 'event 2',
        category: 'Test',
        allDay: false
      };

      createController();

      scope.eventClicked(eventToModify);
      eventToModify.allDay = true;
      dfd.resolve(eventToModify);
      scope.$digest();

      expect(mockCalendar.fullCalendar.calledWith('removeEvents', 2)).to.be.true;
    });

    it('removes the event from the calendar if the title changes', function() {
      mockCalendarData.events.returns([
        {
          _id: 1,
          title: 'event 1'
        },
        {
          _id: 2,
          title: 'event 2',
          category: 'Test',
          allDay: true
        },
        {
          _id: 3,
          title: 'event 3'
        },
        {
          _id: 4,
          title: 'event 4'
        }
      ]);

      var eventToModify = {
        _id: 2,
        title: 'event 2',
        category: 'Test',
        allDay: true
      };

      createController();

      scope.eventClicked(eventToModify);
      eventToModify.title = 'event 2 modified';
      dfd.resolve(eventToModify);
      scope.$digest();

      expect(mockCalendar.fullCalendar.calledWith('removeEvents', 2)).to.be.true;
    });
  });

  describe('limiting to my events', function() {
    var mockCalendarData;
    var mockCalendar;

    beforeEach(function() {
      mockCalendar = sinon.stub({
        fullCalendar: function() {
        }
      });
      scope.calendar = mockCalendar;

      mockCalendarData = sinon.stub({
        load: function() {
        },
        events: function() {
        },
        excludedEvents: function() {
        },
        limitToMine:function(){
        }
      });
      mockCalendarData.events.returns([]);
      mockCalendarData.excludedEvents.returns([
        {
          _id: 1,
          title: 'event 1'
        },
        {
          _id: 2,
          title: 'event 2'
        },
        {
          _id: 3,
          title: 'event 3'
        },
        {
          _id: 4,
          title: 'event 4'
        }
      ]);
    });

    function createController() {
      var queryDfd = q.defer();
      mockCalendarData.load.returns(queryDfd.promise);

      $controllerConstructor('calendarCtrl', {
        $scope: scope,
        $modal: {},
        calendarData: mockCalendarData
      });

      queryDfd.resolve(true);
      scope.$digest();
    }

    it('calls limitToMine when checked', function(){
      createController();
      scope.showOnlyMine = true;
      scope.$digest();
      expect(mockCalendarData.limitToMine.calledOnce).to.be.true;
      expect(mockCalendarData.limitToMine.calledWith(true)).to.be.true;
    });

    it('calls limitToMine when unchecked', function(){
      createController();
      scope.showOnlyMine = false;
      scope.$digest();
      expect(mockCalendarData.limitToMine.calledOnce).to.be.true;
      expect(mockCalendarData.limitToMine.calledWith(false)).to.be.true;
    });

    it('gets events to exclude if checked', function(){
      createController();
      scope.showOnlyMine = true;
      scope.$digest();
      expect(mockCalendarData.excludedEvents.calledOnce).to.be.true;
      expect(mockCalendarData.events.calledTwice).to.be.true;
      expect(mockCalendar.fullCalendar.called).to.be.true;
    });

    it('gets all events if unchecked', function(){
      createController();
      scope.showOnlyMine = false;
      scope.$digest();
      expect(mockCalendarData.excludedEvents.called).to.be.false;
      expect(mockCalendarData.events.calledTwice).to.be.true;
      expect(mockCalendar.fullCalendar.called).to.be.false;
    });
  });
});