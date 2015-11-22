(function() {
  'use strict';

  describe('homeTrax.common.resources.Project', function() {
    var httpBackend;
    var project;
    var scope;
    var testData;

    var config;

    beforeEach(module('homeTrax.common.resources.Project'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($rootScope, $httpBackend, _Project_, _config_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      project = _Project_;
      config = _config_;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('Should exist', function() {
      expect(project).to.exist;
    });

    describe('query', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/projects')
          .respond(testData);
        res = project.query({});
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.length).to.equal(3);
        expect(res[0].testTag).to.equal(42);
        expect(res[1].testTag).to.equal(73);
        expect(res[2].testTag).to.equal(314159);
      });
    });

    describe('get', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/projects/2')
          .respond(testData[1]);
        res = project.get({
          id: 2
        });
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.testTag).to.equal(73);
      });
    });

    describe('POST', function() {
      it('saves new data properly', function() {
        httpBackend.expectPOST(config.dataService + '/projects')
          .respond({});
        var res = project.save({
          name: 'Bozo'
        });
        httpBackend.flush();
      });

      it('saves existing data properly', function() {
        httpBackend.expectPOST(config.dataService + '/projects/2')
          .respond({});
        var res = project.save(testData[1]);
        httpBackend.flush();
      });
    });

    function initializeTestData() {
      testData = [{
        _id: 1,
        name: 'Fred',
        testTag: 42
      }, {
        _id: 2,
        name: 'Bob',
        testTag: 73
      }, {
        _id: 3,
        name: 'Jack',
        testTag: 314159
      }];
    }
  });
}());
