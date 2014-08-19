'use strict'

describe('eventEditorCtrl', function() {
  var scope;
  var $controllerConstructor;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  it('exists', function() {
    var ctrl = $controllerConstructor('eventEditorCtrl', {
      $scope: scope,
      $modalInstance: {},
      eventModel: {}
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
        eventModel: model
      });
    }

    it('sets the model', function() {
      createController();
      expect(scope.model).to.deep.equal(model);
    });

    it('sets the title to create if no _id', function() {
      createController();
      expect(scope.title).to.equal('New Event');
    });

    it('sets the title to edit if _id', function() {
      model._id = 1;
      createController();
      expect(scope.title).to.equal('Edit Event');
    });

    it('starts with no errors', function() {
      createController();
      expect(scope.errorMessage).to.equal('');
    });

    it('sets the start and end date to today if they are not specified in the model', function() {
      model.start = undefined;
      model.end = undefined;
      createController();
      var expectedStart = moment(moment().format('YYYY-MM-DD')).hour(8);
      var expectedEnd = moment(moment().format('YYYY-MM-DD')).hour(9);

      expect(scope.model.start).to.equal(expectedStart.format(scope.dateTimeFormat));
      expect(scope.model.end).to.equal(expectedEnd.format(scope.dateTimeFormat));
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
        eventModel: model
      });
      scope.$digest();

      return ctrl;
    }


    it('does not change if the end date changes', function() {
      createController();

      scope.model.end = '08/02/2014 8:00 AM';
      scope.$digest();

      expect(scope.model.start).to.equal('06/20/2014 12:00 PM');
    });

    it('is truncated to hour zero if event becomes all day event', function() {
      createController();

      scope.model.allDay = true;
      scope.$digest();

      expect(scope.model.start).to.equal('06/20/2014');
    });

    it('defaults to 8:00am if event becomes not an all day edvent', function() {
      createController();

      scope.model.allDay = true;
      scope.$digest();
      scope.model.allDay = false;
      scope.$digest();

      expect(scope.model.start).to.equal('06/20/2014 8:00 AM');
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
        eventModel: model
      });
      scope.$digest();

      return ctrl;
    }


    it('maintains hours difference when begin date changes', function() {
      createController();

      scope.model.start = '08/02/2014 8:00 AM';
      scope.$digest();

      expect(scope.model.end).to.equal('08/02/2014 9:30 AM');
    });

    it('maintains new hours different if end date changes then begin date changes', function() {
      createController();

      scope.model.end = '08/02/2014 8:30 AM';
      scope.model.start = '08/02/2014 8:00 AM';
      scope.$digest();

      expect(scope.model.end).to.equal('08/02/2014 10:00 AM');
    });

    it('is truncated to hour zero when event becomes all day event', function() {
      createController();

      scope.model.allDay = true;
      scope.$digest();

      expect(scope.model.end).to.equal('08/02/2014');
    });

    it('defaults to 9:00am when event becomes not an all day edvent', function() {
      createController();

      scope.model.allDay = true;
      scope.$digest();
      scope.model.allDay = false;
      scope.$digest();

      expect(scope.model.end).to.equal('08/02/2014 9:00 AM');
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
        eventModel: mockModel
      });
    }

    it('save the event', function() {
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
      scope.model.start = null;
      scope.validate();
      expect(scope.errorMessage).to.equal('Start Date is required');
    });

    it('sets an error if there is no end date', function() {
      scope.model.end = null;
      scope.validate();
      expect(scope.errorMessage).to.equal('End Date is required');
    });
  });
});