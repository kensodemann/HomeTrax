/* global beforeEach describe expect inject it moment sinon */
(function() {
  'use strict';

  describe('eventEditor', function() {
    var serviceUnderTest;

    var mockBloodhound;
    var mockBloodhoundConstructor;
    var mockCalendar;
    var mockCalendarEvent;
    var mockColors;
    var mockEventCategory;
    var mockIdentity;
    var mockMessageDialogService;
    var mockModal;
    var mockModalConstructor;
    var mockNotifier;
    var mockUsers;
    var mockWindow;

    var askDfd;
    var usersGetDfd;

    var rootScope;

    var testEventCategories;

    beforeEach(module('app.calendar'));

    beforeEach(function() {
      buildMockCalendar();
      buildMockCalendarEvent();
      buildMockColors();
      setupTestEventCategories();
      buildMockEventCategory();
      buildMockIdentity();
      buildMockMessageDialogService();
      buildMockModal();
      buildMockNotifier();
      buildMockUsers();
      buildMockWindow();

      module(function($provide) {
        $provide.value('$modal', mockModalConstructor);
        $provide.value('notifier', mockNotifier);
        $provide.value('EventCategory', mockEventCategory);
        $provide.value('$window', mockWindow);
        $provide.value('messageDialogService', mockMessageDialogService);
        $provide.value('identity', mockIdentity);
        $provide.value('users', mockUsers);
        $provide.value('colors', mockColors);
      });

      function setupTestEventCategories() {
        testEventCategories = [{
          "name": "Test",
          "_id": "5401cb6f95b028e003e6bd17"
        }, {
          "name": "Appointments",
          "_id": "5401cf2e95b028e003e6bd18"
        }, {
          "name": "Holiday",
          "_id": "540475e3d587a23c155222f5"
        }, {
          "name": "Family",
          "_id": "54047fd2d587a23c155222fa"
        }, {
          "name": "Fried Chicken",
          "_id": "542b789f78f2be0815c90fe9"
        }, {
          "name": "Technology",
          "_id": "542bfa75f7b14c80126a9b8b"
        }, {
          "name": "Church",
          "_id": "542bfaa2f7b14c80126a9b8d"
        }, {
          "name": "Meeting",
          "_id": "542bfd0eb16d48880e05079c"
        }, {
          "name": "Travel",
          "_id": "542bfd53b16d48880e05079f"
        }, {
          "name": "Recreation",
          "_id": "542f5824c68b48fc13a7674e"
        }];
      }

      function buildMockCalendar() {
        mockCalendar = sinon.stub({
          fullCalendar: function() {}
        });
      }

      function buildMockCalendarEvent() {
        mockCalendarEvent = sinon.stub({
          $save: function() {},
          $remove: function() {}
        });
        mockCalendarEvent.start = moment();
        mockCalendarEvent.end = moment();
      }

      function buildMockColors() {
        mockColors = sinon.stub({
          getColor: function() {}
        });
        mockColors.getColor.returns('#343434');
        mockColors.getColor.withArgs(42).returns('#121212');
        mockColors.calendar = 42;
      }

      function buildMockEventCategory() {
        mockEventCategory = sinon.stub({
          query: function() {},
          save: function() {}
        });
        mockEventCategory.query.returns(testEventCategories);
      }

      function buildMockIdentity() {
        mockIdentity = sinon.stub();
        mockIdentity.currentUser = {
          _id: "42"
        };
      }

      function buildMockMessageDialogService() {
        mockMessageDialogService = sinon.stub({
          ask: function() {}
        });
      }

      function buildMockModal() {
        var mockPromise = sinon.stub({
          then: function() {}
        });

        mockModal = sinon.stub({
          $promise: mockPromise,
          hide: function() {},
          show: function() {}
        });
        mockModalConstructor = sinon.stub().returns(mockModal);
      }

      function buildMockNotifier() {
        mockNotifier = sinon.stub({
          notify: function() {},
          error: function() {}
        });
      }

      function buildMockWindow() {
        mockBloodhound = sinon.stub({
          initialize: function() {},
          ttAdapter: function() {}
        });
        mockBloodhoundConstructor = sinon.stub().returns(mockBloodhound);
        mockBloodhoundConstructor.tokenizers = {
          whitespace: 'whitespace'
        };
        mockWindow = {
          Bloodhound: mockBloodhoundConstructor
        };
      }

      function buildMockUsers() {
        mockUsers = sinon.stub({
          get: function() {}
        });
      }
    });

    beforeEach(inject(function($q, $rootScope, eventEditor) {
      askDfd = $q.defer();
      mockMessageDialogService.ask.returns(askDfd.promise);
      usersGetDfd = $q.defer();
      mockUsers.get.returns(usersGetDfd.promise);
      serviceUnderTest = eventEditor;
      rootScope = $rootScope;
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
      var testEvent;
      beforeEach(function() {
        testEvent = {
          "_id": "547bb0daeb5412000042fac1",
          "start": moment("2014-12-01T01:00:00.000Z"),
          "end": moment("2014-12-01T02:30:00.000Z"),
          "allDay": false,
          "title": "AA Meeting",
          "category": "Personal",
          "private": true,
          "userId": "53a4dcea7c6dc30000bee3ab"
        };
      });

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
        var zoneOffset = moment().zone() * 60000;
        serviceUnderTest.open(testEvent, 'anything');
        expect(ctrl.model.title).to.equal('AA Meeting');
        expect(ctrl.model.isAllDayEvent).to.be.false;
        expect(ctrl.model.start).to.equal(moment('2014-12-01T01:00:00.000Z').valueOf() + zoneOffset);
        expect(ctrl.model.end).to.equal(moment('2014-12-01T02:30:00.000Z').valueOf() + zoneOffset);
        expect(ctrl.model.category).to.equal('Personal');
        expect(ctrl.model.isPrivate).to.be.true;
      });

      it("uses the user's default color for calendar events", function() {
        var ctrl = getEditorCtrl();
        serviceUnderTest.open(testEvent, 'anything');
        expect(mockColors.getColor.calledOnce).to.be.true;
        expect(mockColors.getColor.calledWithExactly(mockColors.calendar)).to.be.true;
        expect(ctrl.model.color).to.equal('#121212');
      });

      it('subtracts a day from the end date if this is an all-day event', function() {
        testEvent.allDay = true;
        testEvent.start = moment("2014-12-01T00:00:00.000Z");
        testEvent.end = moment("2014-12-03T00:00:00.000Z");
        var ctrl = getEditorCtrl();
        var zoneOffset = moment().zone() * 60000;
        serviceUnderTest.open(testEvent, 'anything');
        expect(ctrl.model.isAllDayEvent).to.be.true;
        expect(ctrl.model.start).to.equal(moment('2014-12-01T00:00:00.000Z').valueOf() + zoneOffset);
        expect(ctrl.model.end).to.equal(moment('2014-12-02T00:00:00.000Z').valueOf() + zoneOffset);
      });

      it('allows editing if the event has no userId', function() {
        var ctrl = getEditorCtrl();
        testEvent.userId = undefined;
        serviceUnderTest.open(testEvent, 'anything');
        expect(ctrl.isReadonly).to.be.false;
      });

      it("allows editing if the event's userId matches the identity", function() {
        var ctrl = getEditorCtrl();
        mockIdentity.currentUser._id = testEvent.userId;
        serviceUnderTest.open(testEvent, 'anything');
        expect(ctrl.isReadonly).to.be.false;
      });

      describe('events for other users', function() {
        var ctrl;
        beforeEach(function() {
          ctrl = getEditorCtrl();
        });

        it('cannot be edited by the current user', function() {
          mockIdentity.currentUser._id = '4273';
          serviceUnderTest.open(testEvent, 'anything');
          expect(ctrl.isReadonly).to.be.true;
        });

        it("displays a message with the ownwer's name if the owner exists", function() {
          mockIdentity.currentUser._id = '4273';
          serviceUnderTest.open(testEvent, 'anything');
          usersGetDfd.resolve({
            firstName: 'Jackie',
            lastName: 'Jones'
          });
          rootScope.$digest();
          expect(ctrl.eventOwnerName).to.equal('Jackie Jones');
        });

        it("displays a message with a generic name if the owner does not exist", function() {
          mockIdentity.currentUser._id = '4273';
          serviceUnderTest.open(testEvent, 'anything');
          usersGetDfd.resolve();
          rootScope.$digest();
          expect(ctrl.eventOwnerName).to.equal('another user');
        });
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
      var zoneOffset;
      beforeEach(function() {
        zoneOffset = moment().zone() * 60000;
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

          expect(editor.ctrl.model.start.valueOf()).to.equal(moment('2014-06-20T12:00:00').valueOf() + zoneOffset);
        });

        it('does not change if the all day indicator is toggled', function() {
          editor.ctrl.model.isAllDayEvent = true;
          editor.$digest();
          editor.ctrl.model.isAllDayEvent = false;
          editor.$digest();

          expect(editor.ctrl.model.start.valueOf()).to.equal(moment('2014-06-20T12:00:00').valueOf() + zoneOffset);
        });
      });

      describe('End', function() {
        it('maintains hours difference when begin datetime changes', function() {
          editor.ctrl.model.start = moment(moment('2014-08-02T08:00:00').valueOf() + zoneOffset).toDate();
          editor.$digest();

          expect(editor.ctrl.model.end.valueOf()).to.equal(moment('2014-08-02T09:30:00').valueOf() + zoneOffset);
        });

        it('maintains new hours difference if end datetime changes then begin datetime changes', function() {
          editor.ctrl.model.end = moment('2014-08-02T08:30:00').valueOf() + zoneOffset;
          editor.ctrl.model.start = moment('2014-06-20T14:00:00').valueOf() + zoneOffset;
          editor.$digest();

          expect(editor.ctrl.model.end).to.equal(moment('2014-08-02T10:30:00').valueOf() + zoneOffset);
        });

        it('does not change if the all day indicator is toggled', function() {
          editor.ctrl.model.isAllDayEvent = true;
          editor.$digest();
          editor.ctrl.model.isAllDayEvent = false;
          editor.$digest();

          expect(editor.ctrl.model.end.valueOf()).to.equal(moment('2014-06-20T13:30:00').valueOf() + zoneOffset);
        });
      });
    });

    describe('saving events', function() {
      var ctrl;
      var zoneOffset;
      beforeEach(function() {
        zoneOffset = moment().zone() * 60000;
        serviceUnderTest.initialize(mockCalendar);
        serviceUnderTest.open(mockCalendarEvent);
        ctrl = getEditorCtrl();
        ctrl.model = {};
        ctrl.model.title = 'Eat Something';
        ctrl.model.isAllDayEvent = false;
        ctrl.model.start = moment('2014-07-01T12:00:00').valueOf() + zoneOffset;
        ctrl.model.end = moment('2014-07-02T13:00:00').valueOf() + zoneOffset;
        ctrl.model.category = 'Health & Fitness';
        ctrl.model.isPrivate = true;
        ctrl.model.user = 'KWS';
        ctrl.model.color = "#abcdef";
      });

      it('copies the data to the resource', function() {
        ctrl.ok();
        expect(mockCalendarEvent.title).to.equal('Eat Something');
        expect(mockCalendarEvent.allDay).to.be.false;
        expect(mockCalendarEvent.start.valueOf()).to.equal(moment('2014-07-01T12:00:00').valueOf());
        expect(mockCalendarEvent.end.valueOf()).to.equal(moment('2014-07-02T13:00:00').valueOf());
        expect(mockCalendarEvent.category).to.equal('Health & Fitness');
        expect(mockCalendarEvent.private).to.be.true;
        expect(mockCalendarEvent.user).to.equal('KWS');
        expect(mockCalendarEvent.eventType).to.equal('miscellaneous');
        expect(mockCalendarEvent.color).to.equal('#abcdef');
      });

      it('sets start time to midnight for all day events', function() {
        ctrl.model.isAllDayEvent = true;
        ctrl.ok();
        expect(mockCalendarEvent.allDay).to.be.true;
        expect(mockCalendarEvent.start.valueOf()).to.equal(moment('2014-07-01T00:00:00').valueOf() - zoneOffset);
      });

      it('sets end time to the start of the following day for all day events', function() {
        ctrl.model.isAllDayEvent = true;
        ctrl.ok();
        expect(mockCalendarEvent.allDay).to.be.true;
        expect(mockCalendarEvent.end.valueOf()).to.equal(moment('2014-07-03T00:00:00').valueOf() - zoneOffset);
      });

      it('grabs the name if category is an object', function() {
        // This covers the case that a category is chosen directly from the typeahead drop down
        ctrl.model.category = {
          _id: 1,
          name: 'Holiday'
        };
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