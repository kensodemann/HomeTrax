'use strict'

describe('eventEditorCtrl', function() {
  var scope;
  var $controllerConstructor;
  var mockEventCategory;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
    mockEventCategory = sinon.stub({
      query: function() {}
    });
    mockEventCategory.query.returns([{
      _id: 1,
      name: 'cat1'
    }, {
      _id: 2,
      name: 'cat2'
    }]);
  }));

  it('exists', function() {
    var ctrl = $controllerConstructor('eventEditorCtrl', {
      $scope: scope,
      $modalInstance: {},
      eventModel: {},
      eventCategory: mockEventCategory
    });

    expect(ctrl).to.not.be.undefined;
  });

  describe('instantiation', function() {
    var model;

    beforeEach(function() {
      model = {
        title: 'Eat Something',
        allDay: false,
        start: moment('2014-06-20T12:00:00'),
        end: moment('2014-06-20T13:00:00'),
        category: 'Health & Fitness',
        private: false,
        user: 'KWS'
      };
    });

    function createController() {
      return $controllerConstructor('eventEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        eventModel: model,
        eventCategory: mockEventCategory
      });
    }

    it('sets the editorTitle to create if no _id', function() {
      createController();
      expect(scope.editorTitle).to.equal('New Event');
    });

    it('sets the editorTitle to edit if _id', function() {
      model._id = 1;
      createController();
      expect(scope.editorTitle).to.equal('Edit Event');
    });

    it('starts with no errors', function() {
      createController();
      expect(scope.errorMessage).to.equal('');
    });

    it('sets editable fields in the editor model based on the data model', function() {
      createController();

      expect(scope.model.title).to.equal('Eat Something');
      expect(scope.model.isAllDayEvent).to.be.false;
      expect(scope.model.startDate).to.equal('06/20/2014 12:00 PM');
      expect(scope.model.endDate).to.equal('06/20/2014 1:00 PM');
      expect(scope.model.category).to.equal('Health & Fitness');
      expect(scope.model.isPrivate).to.be.false;
      expect(scope.model.user).to.equal('KWS');
    });

    it('uses the date only format to set start and end date strings for all day events', function() {
      model.allDay = true;
      createController();

      expect(scope.model.isAllDayEvent).to.be.true;
      expect(scope.model.startDate).to.equal('06/20/2014');
      expect(scope.model.endDate).to.equal('06/20/2014');
    });

    it('sets the start and end date to today if they are not specified in the model', function() {
      model.start = undefined;
      model.end = undefined;
      createController();
      var expectedStart = moment(moment().format('YYYY-MM-DD')).hour(8);
      var expectedEnd = moment(moment().format('YYYY-MM-DD')).hour(9);

      expect(scope.model.startDate).to.equal(expectedStart.format(scope.dateTimeFormat));
      expect(scope.model.endDate).to.equal(expectedEnd.format(scope.dateTimeFormat));
    });

    it('gets the category list', function() {
      createController();
      expect(mockEventCategory.query.calledOnce).to.be.true;
    });
  });

  describe('begin date', function() {
    var model;

    beforeEach(function() {
      model = {
        title: 'Eat Something',
        allDay: false,
        start: moment('2014-06-20T12:00:00'),
        end: moment('2014-06-20T13:00:00'),
        category: 'Health & Fitness',
        private: false,
        user: 'KWS'
      };
    });

    function createController() {
      var ctrl = $controllerConstructor('eventEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        eventModel: model,
        eventCategory: mockEventCategory
      });
      scope.$digest();

      return ctrl;
    }


    it('does not change if the end date changes', function() {
      createController();

      scope.model.endDate = '08/02/2014 8:00 AM';
      scope.$digest();

      expect(scope.model.startDate).to.equal('06/20/2014 12:00 PM');
    });

    it('is truncated to hour zero if event becomes all day event', function() {
      createController();

      scope.model.isAllDayEvent = true;
      scope.$digest();

      expect(scope.model.startDate).to.equal('06/20/2014');
    });

    it('defaults to 8:00am if event becomes not an all day edvent', function() {
      createController();

      scope.model.isAllDayEvent = true;
      scope.$digest();
      scope.model.isAllDayEvent = false;
      scope.$digest();

      expect(scope.model.startDate).to.equal('06/20/2014 8:00 AM');
    });
  });

  describe('end date', function() {
    var model;

    beforeEach(function() {
      model = {
        title: 'Eat Something',
        allDay: false,
        start: moment('2014-08-02T06:30:00'),
        end: moment('2014-08-02T08:00:00'),
        category: 'Health & Fitness',
        private: false,
        user: 'KWS'
      };
    });

    function createController() {
      var ctrl = $controllerConstructor('eventEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        eventModel: model,
        eventCategory: mockEventCategory
      });
      scope.$digest();

      return ctrl;
    }


    it('maintains hours difference when begin date changes', function() {
      createController();

      scope.model.startDate = '08/02/2014 8:00 AM';
      scope.$digest();

      expect(scope.model.endDate).to.equal('08/02/2014 9:30 AM');
    });

    it('maintains new hours different if end date changes then begin date changes', function() {
      createController();

      scope.model.endDate = '08/02/2014 8:30 AM';
      scope.model.startDate = '08/02/2014 8:00 AM';
      scope.$digest();

      expect(scope.model.endDate).to.equal('08/02/2014 10:00 AM');
    });

    it('is truncated to hour zero when event becomes all day event', function() {
      createController();

      scope.model.isAllDayEvent = true;
      scope.$digest();

      expect(scope.model.endDate).to.equal('08/02/2014');
    });

    it('defaults to 9:00am when event becomes not an all day edvent', function() {
      createController();

      scope.model.isAllDayEvent = true;
      scope.$digest();
      scope.model.isAllDayEvent = false;
      scope.$digest();

      expect(scope.model.endDate).to.equal('08/02/2014 9:00 AM');
    });
  });

  describe('ok', function() {
    var mockModalInstance;
    var mockModel;

    beforeEach(function() {
      mockModalInstance = sinon.stub({
        dismiss: function() {},
        close: function() {}
      });
      mockModel = sinon.stub({
        $save: function() {}
      });
    });

    function createController(model) {
      return $controllerConstructor('eventEditorCtrl', {
        $scope: scope,
        $modalInstance: mockModalInstance,
        eventModel: mockModel,
        eventCategory: mockEventCategory
      });
    }

    it('copies editable data from the scope to the model', function() {
      createController(mockModel);
      scope.model.title = 'Bite Me!';
      scope.model.category = 'Appointments';
      scope.model.isAllDayEvent = false;
      scope.model.startDate = '07/15/2014 2:00 PM';
      scope.model.endDate = '07/16/2014 6:00 AM';
      scope.model.isPrivate = true;
      scope.model.user = 'Fred';

      scope.ok();

      expect(mockModel.title).to.equal('Bite Me!');
      expect(mockModel.category).to.equal('Appointments');
      expect(mockModel.allDay).to.be.false;
      expect(mockModel.start.format()).to.equal(moment('07/15/2014 2:00 PM', 'MM/DD/YYYY h:mm A').format());
      expect(mockModel.end.format()).to.equal(moment('07/16/2014 6:00 AM', 'MM/DD/YYYY h:mm A').format());
      expect(mockModel.private).to.be.true;
      expect(mockModel.user).to.equal('Fred');
    });

    it('uses existing category with same name but different case', function() {
      mockEventCategory.query.returns([{
        _id: 1,
        name: 'Test'
      }]);
      createController(mockModel);
      scope.model.category = 'teSt';

      scope.ok();

      expect(mockModel.category).to.equal('Test');
    });

    it('uses the name of the selected object if selected', function() {
      createController(mockModel);
      scope.model.category = {
        _id: 1234,
        name: 'Relaxation'
      };
      scope.ok();

      expect(mockModel.category).to.equal('Relaxation');
    })

    it('copies just the name if the category is an object', function() {
      createController(mockModel);
      scope.model.category = {
        _id: '1234',
        name: 'Sax and Violins',
        description: 'this is the load, man'
      };

      scope.ok();

      expect(mockModel.category).to.equal('Sax and Violins');
    });

    it('saves the event', function() {
      createController(mockModel);
      scope.ok();

      expect(mockModel.$save.calledOnce).to.be.true;
    });

    it('closes the modal if http request successful', function() {
      createController(mockModel);
      scope.ok();
      mockModel.$save.callArgWith(0, mockModel);

      expect(mockModalInstance.close.calledOnce).to.be.true;
    });

    it('notifies user if http request fails', function() {
      createController(mockModel);
      scope.ok();
      mockModel.$save.callArgWith(1, {
        status: 400,
        statusText: 'something went wrong',
        data: {
          reason: 'because you suck eggs'
        }
      });

      expect(scope.errorMessage).to.equal('because you suck eggs');
      expect(mockModalInstance.close.called).to.be.false;
    });
  });

  describe('cancel', function() {
    var modalInstance;

    beforeEach(function() {
      modalInstance = sinon.stub({
        dismiss: function() {}
      });
    });

    it('dismisses the modal', function() {
      $controllerConstructor('eventEditorCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        eventModel: {}
      });

      scope.cancel();

      expect(modalInstance.dismiss.calledOnce).to.be.true;
    });
  });

  describe('validation', function() {
    var model;

    beforeEach(function() {
      model = {
        title: 'Eat Something',
        allDay: false,
        start: moment('2014-06-20T12:00:00'),
        end: moment('2014-06-20T13:00:00'),
        category: 'Health & Fitness',
        private: false,
        user: 'KWS'
      };

      $controllerConstructor('eventEditorCtrl', {
        $scope: scope,
        $modalInstance: {},
        eventModel: model
      });
    });

    it('sets an error if there is no title', function() {
      scope.model.title = "";
      scope.validate();
      expect(scope.errorMessage).to.equal('Event Title is required');
    });

    it('sets an error if there is no begin date', function() {
      scope.model.startDate = null;
      scope.validate();
      expect(scope.errorMessage).to.equal('Start Date is required');
    });

    it('sets an error if there is no end date', function() {
      scope.model.endDate = null;
      scope.validate();
      expect(scope.errorMessage).to.equal('End Date is required');
    });
  });
});