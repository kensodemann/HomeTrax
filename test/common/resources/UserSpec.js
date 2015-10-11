(function() {
  'use strict';

  describe('User', function() {
    var config;
    var httpBackend;
    var User;
    var scope;
    var testData;

    beforeEach(function() {
      testData = [{
        userId: '1',
        testTag: 1
      }, {
        userId: '2',
        testTag: 2
      }, {
        userId: '3',
        testTag: 4,
        color: '#ff0000'
      }, {
        userId: '4',
        testTag: 5
      }, {
        userId: '5',
        testTag: 7
      }];
    });

    beforeEach(module('homeTrax.common.resources'));

    beforeEach(inject(function($rootScope, $httpBackend, _config_, _User_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      config = _config_;
      User = _User_;
    }));

    it('exists', function() {
      expect(User).to.not.be.undefined;
    });

    describe('query', function() {
      it('gets the data', function() {
        httpBackend.expectGET(config.dataService + '/users')
          .respond(testData);
        var res = User.query({});
        httpBackend.flush();

        expect(res.length).to.equal(5);
        expect(res[0].testTag).to.equal(1);
        expect(res[2].testTag).to.equal(4);
        expect(res[4].testTag).to.equal(7);
      });

      it('returns the color defined for the user if defined', function() {
        httpBackend.expectGET(config.dataService + '/users')
          .respond(testData);
        var res = User.query({});
        httpBackend.flush();

        expect(res[2].color).to.equal('#ff0000');
      });

      it('defaults the color if it is not defined', function() {
        httpBackend.expectGET(config.dataService + '/users')
          .respond(testData);
        var res = User.query({});
        httpBackend.flush();

        expect(res[0].color).to.equal('#3a87ad');
      });
    });

    describe('is administrator', function() {
      it('is false if the user has no roles', function() {
        var user = new User({
          userId: '42',
          firstName: 'Douglas',
          lastName: 'Adams'
        });
        expect(user.isAdministrator()).to.be.false;
      });

      it('is false if the user does not have the role', function() {
        var user = new User({
          userId: '42',
          firstName: 'Douglas',
          lastName: 'Adams',
          roles: ['butcher', 'baker', 'candlestickmaker']
        });
        expect(user.isAdministrator()).to.be.false;
      });

      it('is trie if the user has the role', function() {
        var user = new User({
          userId: '42',
          firstName: 'Douglas',
          lastName: 'Adams',
          roles: ['butcher', 'baker', 'admin', 'candlestickmaker']
        });
        expect(user.isAdministrator()).to.be.true;
      });
    });
  });
}());