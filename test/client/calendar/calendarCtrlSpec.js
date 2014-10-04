'use strict';

describe('calendarCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var mockCalendar;
  var q;

  beforeEach(function() {
    mockCalendar = sinon.stub({
      fullCalendar: function() {
      }
    });
  });

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    scope.calendar = mockCalendar;

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

  describe('Loading Events', function() {
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
      var loadedEvents;

      scope.eventSources[0].events(moment(), moment(), 'local', function(evts) {
        loadedEvents = evts;
      });

      expect(mockCalendarData.load.calledOnce).to.be.true;
      dfd.resolve(true);
      scope.$digest();
      expect(mockCalendarData.events.calledOnce).to.be.true;
    });
  });

  describe('Editing an Event', function() {
    var mockModal;
    var mockModalInstance;
    var dfd;

    beforeEach(function() {
      dfd = q.defer();
      mockModal = sinon.stub({
        open: function() {
        }
      });
      mockModalInstance = sinon.stub({
        result: dfd.promise
      });
      mockModal.open.returns(mockModalInstance);
    });

    function createController() {
      $controllerConstructor('calendarCtrl', {
        $scope: scope,
        $modal: mockModal,
        calendarData: {}
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

    it('reloads the events on save', function() {
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

      expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
      expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
    });

    it('reloads the data after event is removed', function() {
      createController();

      scope.eventClicked({
        _id: 2,
        title: 'event 2'
      });
      dfd.resolve(true);
      scope.$digest();

      expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
      expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
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
        limitToMine: function() {
        }
      });
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

    it('calls limitToMine when checked', function() {
      createController();
      scope.showOnlyMine = true;
      scope.$digest();
      expect(mockCalendarData.limitToMine.calledOnce).to.be.true;
      expect(mockCalendarData.limitToMine.calledWith(true)).to.be.true;
    });

    it('calls limitToMine when unchecked', function() {
      createController();
      scope.showOnlyMine = false;
      scope.$digest();
      expect(mockCalendarData.limitToMine.calledOnce).to.be.true;
      expect(mockCalendarData.limitToMine.calledWith(false)).to.be.true;
    });

    it('refetches events if checked', function() {
      createController();
      scope.showOnlyMine = true;
      scope.$digest();
      expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
      expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
    });

    it('refetches events if unchecked', function() {
      createController();
      scope.showOnlyMine = false;
      scope.$digest();
      expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
      expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
    });
  });
});