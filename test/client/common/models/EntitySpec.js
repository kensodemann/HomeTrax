(function() {
  'use strict';

  describe('Entity', function() {
    var httpBackend;
    var Entity;
    var testData;

    beforeEach(module('app.core'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($httpBackend, _Entity_) {
      httpBackend = $httpBackend;
      Entity = _Entity_;
    }));

    it('Exists', function() {
      expect(Entity).to.exist;
    });

    describe('query', function() {
      it('gets the data', function() {
        httpBackend.expectGET('/api/entities')
          .respond(testData);
        Entity.query({});
        httpBackend.flush();
      });

      it('Transforms purchase dates for the time zone', function() {
        httpBackend.expectGET('/api/entities')
          .respond(testData);
        var res = Entity.query({});
        httpBackend.flush();

        expect(res[0].purchaseDate).to.deep.equal(new Date(2013, 2, 3));
        expect(res[1].purchaseDate).to.be.undefined;
        expect(res[2].purchaseDate).to.deep.equal(new Date(2014, 6, 28));
        expect(res[3].purchaseDate).to.be.undefined;
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

      it('Adjusts the purchase date for TZ', function() {
        res[0].purchaseDate = new Date(2011, 6, 15);
        httpBackend.expectPOST('/api/entities/1', {
          _id: 1,
          name: 'Fred',
          testTag: 42,
          purchaseDate: '2011-07-15T00:00:00.000Z',
          entityType: 'household'
        }).respond({});
        res[0].$save();
        httpBackend.flush();
      });

      it('Adjusts the purchase date in the response', function() {
        res[0].purchaseDate = new Date('2011-07-15T00:00:00.000Z');
        httpBackend.expectPOST('/api/entities/1').respond({
          _id: 1,
          name: 'Fred',
          testTag: 42,
          purchaseDate: '2011-07-15T00:00:00.000Z',
          entityType: 'household'
        });
        res[0].$save();
        httpBackend.flush();
        expect(res[0].purchaseDate).to.deep.equal(new Date(2011, 6, 15));
      });
    });

    function initializeTestData() {
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
        testTag: 320,
        purchaseDate: '2014-07-28T00:00:00.000Z',
        entityType: 'household'
      }, {
        _id: 4,
        name: 'Jack',
        testTag: 314159,
        entityType: 'household'
      }];
    }
  });
}());