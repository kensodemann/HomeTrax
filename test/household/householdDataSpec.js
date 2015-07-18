/*jshint expr: true*/
(function() {
  'use strict';

  describe('householdData', function() {
    var mockEntity;
    var queryDfd;
    var householdData;
    var scope;

    var testData;

    beforeEach(module('app.household'));

    beforeEach(function() {
      testData = [{}];
    });

    beforeEach(function() {
      mockEntity = sinon.stub({
        query: function() {}
      });

      module(function($provide) {
        $provide.value('Entity', mockEntity);
      });
    });

    beforeEach(inject(function($rootScope, $q, _householdData_) {
      scope = $rootScope;
      queryDfd = $q.defer();
      mockEntity.query.returns({$promise: queryDfd.promise});
      householdData = _householdData_;
    }));

    it('Should exist', function() {
      expect(householdData).to.not.be.undefined;
    });

    describe('Load', function() {
      it('queries the entity resource for household entities', function() {
        householdData.load();
        expect(mockEntity.query.calledOnce).to.be.true;
        expect(mockEntity.query.calledWith({entityType: 'household'})).to.be.true;
      });

      it('resolves when the load is complete', function(done) {
        householdData.load().then(function() {
          done();
        });
        queryDfd.resolve({});
        scope.$digest();
      });
    });

    describe('main household', function() {
      it('is initially not assigned', function() {
        expect(!!householdData.household).to.be.false;
      });

      it('is assigned to the last household loaded', function(done) {
        householdData.load().then(function() {
          expect(householdData.household).to.deep.equal({_id: 2, name: 'New House'});
          done();
        });
        queryDfd.resolve([{_id: 1, name: 'old house'},
          {_id: 2, name: 'New House'}]);
        scope.$digest();
      });

      it('remains unassigned if no households are loaded', function(done) {
        householdData.load().then(function() {
          expect(!!householdData.household).to.be.false;
          done();
        });
        queryDfd.resolve();
        scope.$digest();
      });
    });
  });
}());
  
  