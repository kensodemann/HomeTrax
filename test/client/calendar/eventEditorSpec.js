(function() {
  'use strict';

  describe('eventEditor', function() {
    var serviceUnderTest;

    var mockBloodhound;
    var mockBloodhoundConstructor;
    var mockCalendar;
    var mockCalendarEvent;
    var mockEventCategory;
    var mockMessageDialogService;
    var mockModal;
    var mockModalConstructor;
    var mockNotifier;
    var mockWindow;

    var askDfd;

    var testEventCategories;

    beforeEach(module('app.calendar'));

    beforeEach(function() {
      buildMockCalendar();
      buildMockCalendarEvent();
      setupTestEventCategories();
      buildMockEventCategory();
      buildMockMessageDialogService();
      buildMockModal();
      buildMockNotifier();
      buildMockWindow();

      module(function($provide) {
        $provide.value('$modal', mockModalConstructor);
        $provide.value('notifier', mockNotifier);
        $provide.value('EventCategory', mockEventCategory);
        $provide.value('$window', mockWindow);
        $provide.value('messageDialogService', mockMessageDialogService);
      });

      function setupTestEventCategories() {
        testEventCategories = [
          {"name": "Test", "_id": "5401cb6f95b028e003e6bd17"},
          {"name": "Appointments", "_id": "5401cf2e95b028e003e6bd18"},
          {"name": "Holiday", "_id": "540475e3d587a23c155222f5"},
          {"name": "Family", "_id": "54047fd2d587a23c155222fa"},
          {"name": "Fried Chicken", "_id": "542b789f78f2be0815c90fe9"},
          {"name": "Technology", "_id": "542bfa75f7b14c80126a9b8b"},
          {"name": "Church", "_id": "542bfaa2f7b14c80126a9b8d"},
          {"name": "Meeting", "_id": "542bfd0eb16d48880e05079c"},
          {"name": "Travel", "_id": "542bfd53b16d48880e05079f"},
          {"name": "Recreation", "_id": "542f5824c68b48fc13a7674e"}
        ];
      }

      function buildMockCalendar() {
        mockCalendar = sinon.stub({
          fullCalendar: function() {
          }
        });
      }

      function buildMockCalendarEvent() {
        mockCalendarEvent = sinon.stub({
          $save: function() {
          },
          $remove: function() {
          }
        });
        mockCalendarEvent.start = moment();
        mockCalendarEvent.end = moment();
      }

      function buildMockEventCategory() {
        mockEventCategory = sinon.stub({
          query: function() {
          },
          save: function() {
          }
        });
        mockEventCategory.query.returns(testEventCategories);
      }

      function buildMockMessageDialogService() {
        mockMessageDialogService = sinon.stub({
          ask: function() {
          }
        });
      }

      function buildMockModal() {
        var mockPromise = sinon.stub({
          then: function() {
          }
        });

        mockModal = sinon.stub({
          $promise: mockPromise,
          hide: function() {
          },
          show: function() {
          }
        });
        mockModalConstructor = sinon.stub().returns(mockModal);
      }

      function buildMockNotifier() {
        mockNotifier = sinon.stub({
          notify: function() {
          },
          error: function() {
          }
        });
      }

      function buildMockWindow() {
        mockBloodhound = sinon.stub({
          initialize: function() {
          },
          ttAdapter: function() {
          }
        });
        mockBloodhoundConstructor = sinon.stub().returns(mockBloodhound);
        mockBloodhoundConstructor.tokenizers = {
          whitespace: 'whitespace'
        };
        mockWindow = {
          Bloodhound: mockBloodhoundConstructor
        };
      }
    });

    beforeEach(inject(function($q, eventEditor) {
      askDfd = $q.defer();
      mockMessageDialogService.ask.returns(askDfd.promise);
      serviceUnderTest = eventEditor;
    }));

    it('Should exist', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    function getEditorScope() {
      return mockModalConstructor.getCall(0).args[0].scope;
    }

    function getEditorCtrl() {
      return getEditorScope().ctrl;
    }

    describe('Instantiation', function() {
      it('constructs a modal dialog', function() {
        expect(mockModalConstructor.calledOnce).to.be.true;
      });

      it('constructs a scope with a ctrl object', function() {
        var ctrl = getEditorCtrl();
        expect(ctrl).to.not.be.undefined;
      });

      it('uses a static backdrop', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.backdrop).to.equal('static');
      });

      it('uses the correct template', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.template).to.equal('/partials/calendar/templates/eventEditor');
      });

      it('is initially hidden', function() {
        var config = mockModalConstructor.getCall(0).args[0];
        expect(config.show).to.be.false;
      });
    });

    describe('Opening the editor', function() {
      var testEvent = {
        "_id": "547bb0daeb5412000042fac1",
        "start": moment("2014-12-01T01:00:00.000Z"),
        "end": moment("2014-12-01T02:30:00.000Z"),
        "allDay": false,
        "title": "AA Meeting",
        "category": "Personal",
        "private": true,
        "userId": "53a4dcea7c6dc30000bee3ab"
      };

      it('does not show the dialog if it is not ready', function() {
        serviceUnderTest.open(testEvent, 'anything');
        expect(mockModal.show.called).to.be.false;
      });

      it('shows the dialog if it is ready', function() {
        serviceUnderTest.open(testEvent, 'anything');
        mockModal.$promise.then.yield();
        expect(mockModal.show.calledOnce).to.be.true;
      });

      it('sets the title to Edit Event if the mode is "edit"', function() {
        var ctrl = getEditorCtrl();
        serviceUnderTest.open(testEvent, 'edit');
        expect(ctrl.title).to.equal('Edit Event');
      });

      it('sets the title to New Event if the mode is "create"', function() {
        var ctrl = getEditorCtrl();
        serviceUnderTest.open(testEvent, 'create');
        expect(ctrl.title).to.equal('New Event');
      });

      it('copies the passed event to the editor model', function() {
        var ctrl = getEditorCtrl();
        serviceUnderTest.open(testEvent, 'anything');
        expect(ctrl.model.title).to.equal('AA Meeting');
        expect(ctrl.model.isAllDayEvent).to.be.false;
        expect(ctrl.model.start).to.equal(moment('2014-12-01T01:00:00.000Z').valueOf());
        expect(ctrl.model.end).to.equal(moment('2014-12-01T02:30:00.000Z').valueOf());
        expect(ctrl.model.category).to.equal('Personal');
        expect(ctrl.model.isPrivate).to.be.true;
      });

      describe('Event Category Autocompletion', function() {
        it('gets a list of event categories', function() {
          serviceUnderTest.open(testEvent, 'anything');
          expect(mockEventCategory.query.calledOnce).to.be.true;
        });

        it('constructs a bloodhound instance', function() {
          serviceUnderTest.open(testEvent, 'anything');
          expect(mockBloodhoundConstructor.calledOnce).to.be.true;
          var x = mockBloodhoundConstructor.firstCall.args[0];
          expect(x.queryTokenizer).to.equal('whitespace');
          expect(x.local).to.equal(testEventCategories);
        });

        it('initializes the bloodhound instance when the category query returns', function() {
          serviceUnderTest.open(testEvent, 'anything');
          mockEventCategory.query.yield();
          expect(mockBloodhound.initialize.calledOnce).to.be.true;
        });

        it('sets up the category suggestions', function() {
          serviceUnderTest.open(testEvent, 'anything');
          var ctrl = getEditorCtrl();
          expect(ctrl.categories.displayKey).to.equal('name');
        });
      });
    });

    describe('Datetime Handling', function() {
      var editor;
      beforeEach(function() {
        editor = getEditorScope();
        serviceUnderTest.open({
          title: 'Eat Something',
          allDay: false,
          start: moment('2014-06-20T12:00:00'),
          end: moment('2014-06-20T13:30:00'),
          category: 'Health & Fitness',
          private: false,
          user: 'KWS'
        }, 'anything');
        editor.$digest();
      });

      describe('Start', function() {
        it('does not change if the end date changes', function() {
          editor.ctrl.model.end = editor.ctrl.model.end + 1234567;
          editor.$digest();

          expect(editor.ctrl.model.start.valueOf()).to.equal(moment('2014-06-20T12:00:00').valueOf());
        });

        it('does not change if the all day indicator is toggled', function() {
          editor.ctrl.model.isAllDayEvent = true;
          editor.$digest();
          editor.ctrl.model.isAllDayEvent = false;
          editor.$digest();

          expect(editor.ctrl.model.start.valueOf()).to.equal(moment('2014-06-20T12:00:00').valueOf());
        });
      });

      describe('End', function() {
        it('maintains hours difference when begin datetime changes', function() {
          editor.ctrl.model.start = moment('2014-08-02T08:00:00').toDate();
          editor.$digest();

          expect(editor.ctrl.model.end.valueOf()).to.equal(moment('2014-08-02T09:30:00').valueOf());
        });

        it('maintains new hours difference if end datetime changes then begin datetime changes', function() {
          editor.ctrl.model.end = moment('2014-08-02T08:30:00').valueOf();
          editor.ctrl.model.start = moment('2014-06-20T14:00:00').valueOf();
          editor.$digest();

          expect(editor.ctrl.model.end).to.equal(moment('2014-08-02T10:30:00').valueOf());
        });

        it('does not change if the all day indicator is toggled', function() {
          editor.ctrl.model.isAllDayEvent = true;
          editor.$digest();
          editor.ctrl.model.isAllDayEvent = false;
          editor.$digest();

          expect(editor.ctrl.model.end.valueOf()).to.equal(moment('2014-06-20T13:30:00').valueOf());
        });
      });
    });

    describe('saving events', function() {
      var ctrl;
      beforeEach(function() {
        serviceUnderTest.initialize(mockCalendar);
        serviceUnderTest.open(mockCalendarEvent);
        ctrl = getEditorCtrl();
        ctrl.model = {};
        ctrl.model.title = 'Eat Something';
        ctrl.model.isAllDayEvent = false;
        ctrl.model.start = moment('2014-07-01T12:00:00').valueOf();
        ctrl.model.end = moment('2014-07-02T13:00:00').valueOf();
        ctrl.model.category = 'Health & Fitness';
        ctrl.model.isPrivate = true;
        ctrl.model.user = 'KWS';
      });

      it('copies the data to the resource', function() {
        ctrl.model.isAllDayEvent = true;
        ctrl.ok();
        expect(mockCalendarEvent.title).to.equal('Eat Something');
        expect(mockCalendarEvent.allDay).to.be.true;
        expect(mockCalendarEvent.start.valueOf()).to.equal(moment('2014-07-01T12:00:00').valueOf());
        expect(mockCalendarEvent.end.valueOf()).to.equal(moment('2014-07-02T13:00:00').valueOf());
        expect(mockCalendarEvent.category).to.equal('Health & Fitness');
        expect(mockCalendarEvent.private).to.be.true;
        expect(mockCalendarEvent.user).to.equal('KWS');
      });

      it('grabs the name if category is an object', function() {
        // This covers the case that a category is chosen directly from the typeahead drop down
        ctrl.model.category = {_id: 1, name: 'Holiday'};
        ctrl.ok();
        expect(mockCalendarEvent.category).to.equal('Holiday');
      });

      it('uses existing category with same name but different case', function() {
        ctrl.model.category = 'HoLiDay';
        ctrl.ok();
        expect(mockCalendarEvent.category).to.equal('Holiday');
      });

      it('saves the category if it does not already exist', function() {
        ctrl.model.category = 'get to it';
        ctrl.ok();
        expect(mockEventCategory.save.calledWithMatch({
          name: 'get to it'
        })).to.be.true;
      });

      it('does not save the category if it already exists', function() {
        ctrl.model.category = 'Holiday';
        ctrl.ok();
        expect(mockEventCategory.save.called).to.be.false;
      });

      it('saves the resource', function() {
        ctrl.ok();
        expect(mockCalendarEvent.$save.calledOnce).to.be.true;
      });

      it('closes the modal on success', function() {
        ctrl.ok();
        mockCalendarEvent.$save.yield();
        expect(mockModal.hide.calledOnce).to.be.true;
      });

      it('refetches events in the calendar on success', function() {
        ctrl.ok();
        mockCalendarEvent.$save.yield();
        expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
        expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
      });

      it('displays an error on failure and does not close the modal', function() {
        ctrl.ok();
        mockCalendarEvent.$save.callArgWith(1, {
          status: 400,
          statusText: 'something went wrong',
          data: {
            reason: 'because you suck eggs'
          }
        });

        expect(ctrl.errorMessage).to.equal('because you suck eggs');
        expect(mockModal.hide.called).to.be.false;
      });
    });

    describe('removing events', function() {
      var ctrl;
      var scope;
      beforeEach(function() {
        serviceUnderTest.initialize(mockCalendar);
        serviceUnderTest.open(mockCalendarEvent);
        ctrl = getEditorCtrl();
        scope = getEditorScope();
      });

      it('asks the user if they would like to remove the event', function() {
        ctrl.remove();
        expect(mockMessageDialogService.ask.calledOnce).to.be.true;
        expect(mockMessageDialogService.ask.calledWithExactly('Are you sure you would like to remove this event?',
          'Remove Event')).to.be.true;
      });

      it('removes the event if the user answers yes', function(done) {
        ctrl.remove().then(function() {
          expect(mockCalendarEvent.$remove.calledOnce).to.be.true;
          done();
        });
        askDfd.resolve(true);
        scope.$digest();
      });

      it('hides the editor if the remove was successful', function() {
        ctrl.remove();
        askDfd.resolve(true);
        scope.$digest();
        expect(mockModal.hide.called).to.be.false;
        mockCalendarEvent.$remove.yield();
        expect(mockModal.hide.called).to.be.true;
      });

      it('refetches events in the calendar on success', function() {
        ctrl.remove();
        askDfd.resolve(true);
        scope.$digest();
        mockCalendarEvent.$remove.yield();
        expect(mockCalendar.fullCalendar.calledOnce).to.be.true;
        expect(mockCalendar.fullCalendar.calledWith('refetchEvents')).to.be.true;
      });

      it('neither removes the event nor hides the editor if the user answers no', function(done) {
        ctrl.remove().then(function() {
          expect(mockCalendarEvent.$remove.called).to.be.false;
          expect(mockModal.hide.called).to.be.false;
          done();
        });
        askDfd.resolve(false);
        scope.$digest();
      });
    });
  });
}());
  
  