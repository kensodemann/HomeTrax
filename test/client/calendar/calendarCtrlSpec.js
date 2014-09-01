'use strict'

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
    var mockEvent;

    beforeEach(function() {
      mockEvent = sinon.stub({
        query: function() {}
      });
    });

    it('gets the events', function() {
      $controllerConstructor('calendarCtrl', {
        $scope: scope,
        $modal: {},
        calendarEvent: mockEvent
      });

      expect(mockEvent.query.calledOnce).to.be.true;
    });
  });

  describe('Editing an Event', function() {
    var mockEvent;
    var mockModal;
    var mockModalInstance;
    var mockCalendar;
    var dfd;

    beforeEach(function() {
      mockCalendar = sinon.stub({
        fullCalendar: function() {}
      });
      scope.calendar = mockCalendar;

      dfd = q.defer();
      mockModal = sinon.stub({
        open: function() {}
      });
      mockModalInstance = sinon.stub({
        result: dfd.promise
      });
      mockModal.open.returns(mockModalInstance);

      mockEvent = sinon.stub({
        query: function() {},
      });
      mockEvent.query.returns([{
        _id: 1,
        title: 'event 1'
      }, {
        _id: 2,
        title: 'event 2'
      }, {
        _id: 3,
        title: 'event 3'
      }, {
        _id: 4,
        title: 'event 4'
      }]);
    });

    function createController() {
      $controllerConstructor('calendarCtrl', {
        $scope: scope,
        $modal: mockModal,
        calendarEvent: mockEvent
      });
    }

    it('Opens the modal', function() {
      createController();

      scope.eventClicked({
        _id: 2,
        title: 'event 2'
      });

      expect(mockModal.open.calledOnce).to.be.true;
    });

    it('replaces the modified event', function() {
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
      mockEvent.query.returns([{
        _id: 1,
        title: 'event 1'
      }, {
        _id: 2,
        title: 'event 2',
        category: 'Test',
        allDay: true
      }, {
        _id: 3,
        title: 'event 3'
      }, {
        _id: 4,
        title: 'event 4'
      }]);

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
      mockEvent.query.returns([{
        _id: 1,
        title: 'event 1'
      }, {
        _id: 2,
        title: 'event 2',
        category: 'Test',
        allDay: true
      }, {
        _id: 3,
        title: 'event 3'
      }, {
        _id: 4,
        title: 'event 4'
      }]);

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
      mockEvent.query.returns([{
        _id: 1,
        title: 'event 1'
      }, {
        _id: 2,
        title: 'event 2',
        category: 'Test',
        allDay: false
      }, {
        _id: 3,
        title: 'event 3'
      }, {
        _id: 4,
        title: 'event 4'
      }]);

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
      mockEvent.query.returns([{
        _id: 1,
        title: 'event 1'
      }, {
        _id: 2,
        title: 'event 2',
        category: 'Test',
        allDay: true
      }, {
        _id: 3,
        title: 'event 3'
      }, {
        _id: 4,
        title: 'event 4'
      }]);

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
});