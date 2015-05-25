/*jshint expr: true*/
(function() {
  'use strict';

  describe('Entity', function() {
    var httpBackend;
    var Entity;
    var scope;
    var testData;

    beforeEach(module('app.core'));

    beforeEach(function() {
      testData = [{
        _id: 1,
        name: 'Fred',
        testTag: 42,
        purchaseDate: '2013-03-03T00:00:00.000Z',
        entityType: 'household'
      }, {
        _id: 2,
        name: 'Bob',
        testTag: 73,
        entityType: 'dude'
      }, {
        _id: 3,
        name: 'Jack',
        testTag: 314159,
        purchaseDate: '2014-07-28T00:00:00.000Z',
        entityType: 'household'
      }];
    });

    beforeEach(inject(function($rootScope, $httpBackend, _Entity_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      Entity = _Entity_;
    }));

    it('Exists', function() {
      expect(Entity).to.exist;
    });

    describe('query', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET('/api/entities')
          .respond(testData);
        res = Entity.query({});
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.length).to.equal(3);
        expect(res[0].testTag).to.equal(42);
        expect(res[1].testTag).to.equal(73);
        expect(res[2].testTag).to.equal(314159);
      });
    });

    describe('post', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET('/api/entities')
          .respond(testData);
        res = Entity.query({});
        httpBackend.flush();
      });

      it('posts the data using the _id', function() {
        httpBackend.expectPOST('/api/entities/2').respond(res[1]);
        res[1].$save();
        httpBackend.flush();
      });
    });
  });
}());