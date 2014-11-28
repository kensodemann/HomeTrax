/*jshint expr: true*/
(function() {
  'use strict';

  describe('calendarCtrl', function() {
    beforeEach(module('app'));

    var askDfd;
    var loadDfd;

    var scope;
    var $controllerConstructor;
    var mockCalendar;
    var mockCalendarData;
    var mockCalendarEvent;
    var mockEventCategory;
    var mockMessageDialogService;
    var mockAside;
    var mockAsideConstructor;
    var mockModal;
    var mockModalConstructor;
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
      buildMockCalendarEvent();
      buildMockPromise();
      buildMockEventCategory();
      buildMockAside();
      buildMockModal();
      buildMockMessageDialogService();

      function buildMockCalendar() {
        mockCalendar = sinon.stub({
          fullCalendar: function() {
          }
        });
        scope.calendar = mockCalendar;
      }

      function buildMockCalendarData() {
        testEvent = {
          start: moment('2014-05-13T08:00:00'),
          end: moment('2014-05-13T10:00:00')
        };

        mockCalendarData = sinon.stub({
          load: function() {
          },
          events: function() {
          },
          eventCategories: function() {
          },
          newEvent: function() {
          },
          limitToMine: function() {
          },
          excludeCategory: function() {
          },
          includeCategory: function() {
          }
        });
        mockCalendarData.load.returns(loadDfd.promise);
        mockCalendarData.events.returns([]);
        mockCalendarData.eventCategories.returns([
          1, 2, 3, 4, 5, 6, 7
        ]);
        mockCalendarData.newEvent.returns(testEvent);
      }

      function buildMockCalendarEvent() {
        mockCalendarEvent = sinon.stub({
          $save: function() {
          },
          $remove: function() {
          }
        });
      }

      function buildMockEventCategory() {
        mockEventCategory = sinon.stub({
          query: function() {
          },
          save: function() {
          }
        });
        mockEventCategory.query.returns([{
          _id: 1,
          name: 'cat1'
        }, {
          _id: 2,
          name: 'cat2'
        }]);
      }

      function buildMockAside() {
        mockAside = sinon.stub({
          hide: function() {
          },
          show: function() {
          },
          $promise: mockPromise
        });

        mockAsideConstructor = sinon.stub().returns(mockAside);
        mockAsideConstructor.open = sinon.stub();
      }

      function buildMockModal() {
        mockModal = sinon.stub({
          hide: function() {
          },
          show: function() {
          },
          $promise: mockPromise
        });

        mockModalConstructor = sinon.stub().returns(mockModal);
        mockModalConstructor.open = sinon.stub();
      }

      function buildMockPromise() {
        mockPromise = sinon.stub({
          then: function() {
          }
        });
      }

      function buildMockMessageDialogService() {
        mockMessageDialogService = sinon.stub({
          ask: function() {
          }
        });
        mockMessageDialogService.ask.returns(askDfd.promise);
      }
    });

    function createController() {
      return $controllerConstructor('calendarCtrl', {
        $scope: scope,
        $aside: mockAsideConstructor,
        $modal: mockModalConstructor,
        calendarData: mockCalendarData,
        EventCategory: mockEventCategory,
        messageDialogService: mockMessageDialogService
      });
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.not.be.undefined;
    });

    describe('Loading Events', function() {
      it('loads the events', function() {
        createController();
        var loadedEvents;

        scope.eventSources[0].events(moment(), moment(), 'local', function(evts) {
          loadedEvents = evts;
        });

        expect(mockCalendarData.load.calledOnce).to.be.true;
        loadDfd.resolve(true);
        scope.$digest();
        expect(mockCalendarData.events.calledOnce).to.be.true;
      });

      it('loads the event categories', function() {
        createController();
        var aside = getAside();
        var loadedEvents;

        scope.eventSources[0].events(moment(), moment(), 'local', function(evts) {
          loadedEvents = evts;
        });

        loadDfd.resolve(true);
        scope.$digest();
        expect(mockCalendarData.eventCategories.calledOnce).to.be.true;
        expect(aside.eventCategories.length).to.equal(7);
      });
    });

    describe('The event editor', function() {
      describe('Adding a new event', function() {
        it('creates a new event for the day', function() {
          var day = moment();
          createController();

          scope.dayClicked(day);

          expect(mockCalendarData.newEvent.calledOnce).to.be.true;
          expect(mockCalendarData.newEvent.calledWith(day)).to.be.true;
        });

        it("assigns the new event as the editor's resource", function() {
          createController();
          var editor = getEventEditor();

          scope.dayClicked(moment());

          expect(editor.resource).to.equal(testEvent);
        });

        it('Shows the modal', function() {
          createController();

          scope.dayClicked(moment());

          mockPromise.then.yield();
          expect(mockModal.show.calledOnce).to.be.true;
        });

        it('sets the editor title', function() {
          createController();
          var editor = getEventEditor();
          scope.dayClicked(moment());
          expect(editor.title).to.equal('New Event');
        });

        it('hides the remove button', function() {
          createController();
          var editor = getEventEditor();
          scope.dayClicked(moment());
          expect(editor.displayRemoveButton).to.be.false;
        });

        it('sets editable fields in the editor model based on the data model', function() {
          createController();
          var editor = getEventEditor();

          scope.dayClicked(moment());

          expect(editor.model.isAllDayEvent).to.be.false;
          expect(editor.model.isPrivate).to.be.false;
          expect(editor.model.start.valueOf()).to.equal(testEvent.start.valueOf());
          expect(editor.model.end.valueOf()).to.equal(testEvent.end.valueOf());
        });

        it('gets the current list of event categories', function() {
          createController();
          scope.dayClicked(moment());
          expect(mockEventCategory.query.calledOnce).to.be.true;
        });
      });

      describe('Editing an Event', function() {
        it('Opens the modal', function() {
          createController();

          scope.eventClicked({
            _id: 2,
            title: 'event 2',
            start: moment(),
            end: moment()
          });
          mockModal.$promise.then.yield();

          expect(mockModal.show.calledOnce).to.be.true;
        });

        it('sets the editor resource to the passed event', function() {
          createController();
          var editor = getEventEditor();

          var eventToEdit = {
            _id: 42,
            title: 'The answer to life the universe and everything',
            start: moment(),
            end: moment()
          };
          scope.eventClicked(eventToEdit);

          expect(editor.resource).to.equal(eventToEdit);
        });

        it('sets the editor title', function() {
          createController();
          var editor = getEventEditor();
          scope.eventClicked({
            start: moment(),
            end: moment()
          });
          expect(editor.title).to.equal('Edit Event');
        });

        it('displays the remove button', function() {
          createController();
          var editor = getEventEditor();
          scope.eventClicked({
            start: moment(),
            end: moment()
          });
          expect(editor.displayRemoveButton).to.be.true;
        });

        it('sets editable fields in the editor model based on the data model', function() {
          createController();
          var editor = getEventEditor();

          scope.eventClicked({
            title: 'Eat Something',
            allDay: false,
            start: moment('2014-06-20T12:00:00'),
            end: moment('2014-06-20T13:00:00'),
            category: 'Health & Fitness',
            private: false,
            user: 'KWS'
          });

          expect(editor.model.title).to.equal('Eat Something');
          expect(editor.model.isAllDayEvent).to.be.false;
          expect(editor.model.start.valueOf()).to.equal(moment('2014-06-20T12:00:00').valueOf());
          expect(editor.model.end.valueOf()).to.equal(moment('2014-06-20T13:00:00').valueOf());
          expect(editor.model.category).to.equal('Health & Fitness');
          expect(editor.model.isPrivate).to.be.false;
          expect(editor.model.user).to.equal('KWS');
        });

        it('gets the current list of event categories', function() {
          createController();
          scope.eventClicked({
            start: moment(),
            end: moment()
          });
          expect(mockEventCategory.query.calledOnce).to.be.true;
        });
      });

      describe('Datetime Handling', function() {
        var editor;
        beforeEach(function() {
          createController();
          editor = getEventEditor();
          scope.eventClicked({
            title: 'Eat Something',
            allDay: false,
            start: moment('2014-06-20T12:00:00'),
            end: moment('2014-06-20T13:30:00'),
            category: 'Health & Fitness',
            private: false,
            user: 'KWS'
          });
          editor.$digest();
        });

        describe('Start', function() {
          it('does not change if the end date changes', function() {
            editor.model.end = editor.model.end + 1234567;
            editor.$digest();

            expect(editor.model.start.valueOf()).to.equal(moment('2014-06-20T12:00:00').valueOf());
          });

          it('does not change if the all day indicator is toggled', function() {
            editor.model.isAllDayEvent = true;
            editor.$digest();
            editor.model.isAllDayEvent = false;
            editor.$digest();

            expect(editor.model.start.valueOf()).to.equal(moment('2014-06-20T12:00:00').valueOf());
          });
        });

        describe('End', function() {
          it('maintains hours difference when begin datetime changes', function() {
            editor.model.start = moment('2014-08-02T08:00:00').toDate();
            editor.$digest();

            expect(editor.model.end.valueOf()).to.equal(moment('2014-08-02T09:30:00').valueOf());
          });

          it('maintains new hours difference if end datetime changes then begin datetime changes', function() {
            editor.model.end = moment('2014-08-02T08:30:00').valueOf();
            editor.model.start = moment('2014-06-20T14:00:00').valueOf();
            editor.$digest();

            expect(editor.model.end).to.equal(moment('2014-08-02T10:30:00').valueOf());
          });

          it('does not change if the all day indicator is toggled', function() {
            editor.model.isAllDayEvent = true;
            editor.$digest();
            editor.model.isAllDayEvent = false;
            editor.$digest();

            expect(editor.model.end.valueOf()).to.equal(moment('2014-06-20T13:30:00').valueOf());
          });
        });
      });
    });

    describe('editor OK', function() {
      var editor;
      beforeEach(function() {
        createController();
        editor = getEventEditor();
        editor.eventCategories = [{
          _id: 1,
          name: 'cat1'
        }, {
          _id: 2,
          name: 'cat2'
        }];
        editor.model = {};
        editor.model.title = 'Eat Something';
        editor.model.isAllDayEvent = false;
        editor.model.startDate = '06/20/2014';
        editor.model.endDate = '06/21/2014';
        editor.model.start = moment('2014-07-01T12:00:00').toDate();
        editor.model.end = moment('2014-07-02T13:00:00').toDate();
        editor.model.category = 'Health & Fitness';
        editor.model.isPrivate = true;
        editor.model.user = 'KWS';
        editor.resource = mockCalendarEvent;
      });

      it('copies the data to the resource', function() {
        editor.model.isAllDayEvent = true;
        editor.ok();
        expect(editor.resource.title).to.equal('Eat Something');
        expect(editor.resource.allDay).to.be.true;
        expect(editor.resource.start.valueOf()).to.equal(moment('2014-07-01T12:00:00').valueOf());
        expect(editor.resource.end.valueOf()).to.equal(moment('2014-07-02T13:00:00').valueOf());
        expect(editor.resource.category).to.equal('Health & Fitness');
        expect(editor.resource.private).to.be.true;
        expect(editor.resource.user).to.equal('KWS');
      });

      it('grabs the name if category is an object', function() {
        // This covers the case that a category is chosen directly from the typeahead drop down
        editor.model.category = {_id: 1, name: 'Billy'};
        editor.ok();
        expect(editor.resource.category).to.equal('Billy');
      });

      it('uses existing category with same name but different case', function() {
        editor.model.category = 'CaT1';
        editor.ok();
        expect(editor.resource.category).to.equal('cat1');
      });

      it('saves the category if it does not already exist', function() {
        editor.model.category = 'get to it';
        editor.ok();
        expect(mockEventCategory.save.calledWithMatch({
          name: 'get to it'
        })).to.be.true;
      });

      it('does not save the category if it already exists', function() {
        editor.model.category = 'cat1';
        editor.ok();
        expect(mockEventCategory.save.called).to.be.false;
      });

      it('saves the resource', function() {
        editor.ok();
        expect(mockCalendarEvent.$save.calledOnce).to.be.true;
      });

      it('closes the modal on success', function() {
        editor.ok();
        mockCalendarEvent.$save.yield();
        expect(mockModal.hide.calledOnce).to.be.true;
      });

      it('refetches events in the calendar on success', function() {
        editor.ok();
        mockCalendarEvent.$save.yield();
        expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
        expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
      });

      it('displays an error on failure and does not close the modal', function() {
        editor.ok();
        mockCalendarEvent.$save.callArgWith(1, {
          status: 400,
          statusText: 'something went wrong',
          data: {
            reason: 'because you suck eggs'
          }
        });

        expect(editor.errorMessage).to.equal('because you suck eggs');
        expect(mockModal.hide.called).to.be.false;
      });
    });

    describe('editor remove event', function() {
      var editor;
      beforeEach(function() {
        createController();
        editor = getEventEditor();
        editor.resource = mockCalendarEvent;
      });

      it('asks the user if they would like to remove the event', function() {
        editor.remove();
        expect(mockMessageDialogService.ask.calledOnce).to.be.true;
        expect(mockMessageDialogService.ask.calledWithExactly('Are you sure you would like to remove this event?',
          'Remove Event')).to.be.true;
      });

      it('removes the event if the user answers yes', function(done) {
        editor.remove().then(function() {
          expect(mockCalendarEvent.$remove.calledOnce).to.be.true;
          done();
        });
        askDfd.resolve(true);
        editor.$digest();
      });

      it('hides the editor if the remove was successful', function() {
        editor.remove();
        askDfd.resolve(true);
        editor.$digest();
        expect(mockModal.hide.called).to.be.false;
        mockCalendarEvent.$remove.yield();
        expect(mockModal.hide.called).to.be.true;
      });

      it('refetches events in the calendar on success', function() {
        editor.remove();
        askDfd.resolve(true);
        editor.$digest();
        mockCalendarEvent.$remove.yield();
        expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
        expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
      });

      it('neither removes the event nor hides the editor if the user answers no', function(done) {
        editor.remove().then(function() {
          expect(mockCalendarEvent.$remove.called).to.be.false;
          expect(mockModal.hide.called).to.be.false;
          done();
        });
        askDfd.resolve(false);
        editor.$digest();
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

    function getEventEditor() {
      return mockModalConstructor.getCall(0).args[0].scope;
    }

    function getAside() {
      return mockAsideConstructor.getCall(0).args[0].scope;
    }
  });
}());