/*jshint expr: true*/
(function() {
  'use strict';

  describe('householdData', function() {
    var mockHousehold;
    var queryDfd;
    var serviceUnderTest;
    var scope;

    var testData;

    beforeEach(module('app.household'));

    beforeEach(function() {
      testData = [{}];
    });

    beforeEach(function() {
      mockHousehold = sinon.stub({
        query: function() {}
      });

      module(function($provide) {
        $provide.value('Household', mockHousehold);
      });
    });

    beforeEach(inject(function($rootScope, $q, householdData) {
      scope = $rootScope;
      queryDfd = $q.defer();
      mockHousehold.query.returns({$promise: queryDfd.promise});
      serviceUnderTest = householdData;
    }));

    it('Should exist', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    describe('Load', function() {
      it('queries the resource', function() {
        serviceUnderTest.load();
        expect(mockHousehold.query.calledOnce).to.be.true;
      });

      it('resolves when the load is complete', function(done) {
        serviceUnderTest.load().then(function() {
          done();
        });
        queryDfd.resolve({});
        scope.$digest();
      });
    });

    describe('main household', function() {
      it('is initially not assigned', function() {
        expect(!!serviceUnderTest.household).to.be.false;
      });

      it('is assigned to the last household loaded', function(done) {
        serviceUnderTest.load().then(function() {
          expect(serviceUnderTest.household).to.deep.equal({_id: 2, name: 'New House'});
          done();
        });
        queryDfd.resolve([{_id: 1, name: 'old house'},
          {_id: 2, name: 'New House'}]);
        scope.$digest();
      });

      it('remains unassigned if no households are loaded', function(done) {
        serviceUnderTest.load().then(function() {
          expect(!!serviceUnderTest.household).to.be.false;
          done();
        });
        queryDfd.resolve();
        scope.$digest();
      });
    });
  });
}());
  
  