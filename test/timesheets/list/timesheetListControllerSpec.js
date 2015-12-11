(function() {
  'use strict';

  describe('homeTrax.timesheets.list: timesheetListController', function() {
    var config;
    var $controllerConstructor;
    var $httpBackend;

    var testData;

    beforeEach(module('homeTrax.timesheets.list'));

    beforeEach(inject(function($controller, _$httpBackend_, _config_) {
      $controllerConstructor = $controller;
      $httpBackend = _$httpBackend_;
      config = _config_;
    }));

    beforeEach(function() {
      initializeTestData();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    function createController() {
      return $controllerConstructor('timesheetListController', {});
    }

    function setupHttpQuery(status, res) {
      $httpBackend.expectGET(config.dataService + '/timesheets')
        .respond(status || 200, res);
    }

    it('exists', function() {
      setupHttpQuery();
      var controller = createController();
      expect(controller).to.exist;
      $httpBackend.flush();
    });

    it('exposes the queried timesheets for binding', function() {
      setupHttpQuery(200, testData);
      var controller = createController();
      expect(controller.timesheets.length).to.equal(0);
      $httpBackend.flush();
      expect(controller.timesheets.length).to.equal(6);
    });

    function initializeTestData() {
      testData = [{
        _id: 1,
        endDate: '2015-10-01'
      }, {
        _id: 2,
        endDate: '2015-10-08'
      }, {
        _id: 3,
        endDate: '2015-10-15'
      }, {
        _id: 6,
        endDate: '2015-09-05'
      }, {
        _id: 4,
        endDate: '2015-09-12'
      }, {
        _id: 5,
        endDate: '2015-10-31'
      }];
    }
  });
}());