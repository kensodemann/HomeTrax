(function() {
  'use strict';

  describe('FinancialAccount', function() {
    var config;
    var httpBackend;
    var resource;
    var scope;
    var testData;

    beforeEach(module('app.financial'));

    beforeEach(function() {
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
    });

    beforeEach(inject(function($rootScope, $httpBackend, FinancialAccount, _config_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      resource = FinancialAccount;
      config = _config_;
    }));

    it('Should exist', function() {
      expect(resource).to.exist;
    });

    describe('query', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/accounts')
          .respond(testData);
        res = resource.query({});
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.length).to.equal(3);
        expect(res[0].testTag).to.equal(42);
        expect(res[1].testTag).to.equal(73);
        expect(res[2].testTag).to.equal(314159);
      });
    });
  });
}());