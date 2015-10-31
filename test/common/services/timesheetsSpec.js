(function() {
  'use strict';

  describe('homeTrax.common.services.timesheets: timesheets', function() {
    var mockDateUtilities;
    var mockIdentity;
    var mockTimesheetConstructor;
    var mockTimesheet;
    var timesheets;

    var queryDfd;
    var testData;

    var $rootScope;

    beforeEach(module('homeTrax.common.services.timesheets'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(function() {
      mockDateUtilities = sinon.stub({
        weekEndDate: function() {}
      });
    });

    beforeEach(function() {
      mockIdentity = {
        currentUser: {
          _id: 73,
          name: 'Sheldon Cooper'
        }
      }
    });

    beforeEach(function() {
      mockTimesheet = sinon.stub({
        $save: function() {}
      });
      mockTimesheetConstructor = sinon.stub();
      mockTimesheetConstructor.returns(mockTimesheet);
      mockTimesheetConstructor.query = sinon.stub();
      mockTimesheetConstructor.query.returns(testData);
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('Timesheet', mockTimesheetConstructor);
        $provide.value('identity', mockIdentity);
        $provide.value('dateUtilities', mockDateUtilities);
      });
    });

    beforeEach(inject(function(_$rootScope_, $q, _timesheets_) {
      $rootScope = _$rootScope_;
      queryDfd = $q.defer();
      testData.$promise = queryDfd.promise;
      timesheets = _timesheets_;
    }));

    it('exists', function() {
      expect(timesheets).to.exist;
    });

    describe('all', function() {
      it('queries the timesheets', function() {
        var allTimesheets = timesheets.all;
        expect(mockTimesheetConstructor.query.calledOnce).to.be.true;
      });

      it('returns the timesheets array that is queried', function() {
        var allTimesheets = timesheets.all;
        expect(allTimesheets).to.equal(testData);
      });

      it('caches the queried timesheets', function() {
        var allTimesheets = timesheets.all;
        allTimesheets = timesheets.all;
        expect(mockTimesheetConstructor.query.calledOnce).to.be.true;
      });

      it('requeries if the identity has changed since the last query', function() {
        var allTimesheets = timesheets.all;
        mockIdentity.currentUser = {
          _id: 42,
          name: 'Douglas Adams'
        };
        allTimesheets = timesheets.all;
        expect(mockTimesheetConstructor.query.calledTwice).to.be.true;
      });
    });

    describe('getCurrent', function() {
      describe('if timesheets have been queried for the current user', function() {
        beforeEach(function() {
          timesheets.refresh();
          queryDfd.resolve(testData);
          $rootScope.$digest();
          mockTimesheetConstructor.query.reset();
        });

        it('attempts to find the timesheet in the cache', function(done) {
          mockDateUtilities.weekEndDate.returns(new Date(2015, 8, 21));
          timesheets.getCurrent().then(function(current) {
            expect(current).to.equal(testData[1]);
            done();
          });

          $rootScope.$digest();
        });

        it('queries the timesheets if it cannot be found', function() {
          mockDateUtilities.weekEndDate.returns(new Date(2015, 9, 8));
          timesheets.getCurrent();
          expect(mockTimesheetConstructor.query.calledOnce).to.be.true;
          expect(mockTimesheetConstructor.query.calledWith({
            endDate: '2015-10-08'
          })).to.be.true;
        });

        it('resolves the queried timesheet if there is one', function(done) {
          mockDateUtilities.weekEndDate.returns(new Date(2015, 9, 8));
          timesheets.getCurrent().then(function(current) {
            expect(current).to.deep.equal({
              _id: 42,
              endDate: '2015-10-08'
            });
            done();
          });

          mockTimesheetConstructor.query.yield([{
            _id: 42,
            endDate: '2015-10-08'
          }]);
          $rootScope.$digest();
        });

        it('resolves a new saved timesheet if not found', function(done) {
          mockDateUtilities.weekEndDate.returns(new Date(2015, 9, 8));
          timesheets.getCurrent().then(function(current) {
            expect(current).to.equal(mockTimesheet);
            done();
          });

          mockTimesheetConstructor.query.yield([]);
          expect(mockTimesheetConstructor.calledOnce).to.be.true;
          expect(mockTimesheetConstructor.calledWith({
            endDate: '2015-10-08'
          })).to.be.true;
          expect(mockTimesheet.$save.calledOnce).to.be.true;
          $rootScope.$digest();
        });
      });

      describe('if timesheets have not been queried', function() {
        it('queries the timesheets for given end date', function(done) {
          mockDateUtilities.weekEndDate.returns(new Date(2015, 8, 21));
          timesheets.getCurrent().then(function(current) {
            expect(current).to.deep.equal({
              _id: 42,
              endDate: '2015-09-21'
            });
            done();
          });

          expect(mockTimesheetConstructor.query.calledOnce).to.be.true;
          expect(mockTimesheetConstructor.query.calledWith({
            endDate: '2015-09-21'
          })).to.be.true;
          mockTimesheetConstructor.query.yield([{
            _id: 42,
            endDate: '2015-09-21'
          }]);
          $rootScope.$digest();
        });

        it('resolves a new timesheet if not found', function(done) {
          mockDateUtilities.weekEndDate.returns(new Date(2015, 8, 21));
          timesheets.getCurrent().then(function(current) {
            expect(current).to.equal(mockTimesheet);
            done();
          });

          mockTimesheetConstructor.query.yield([]);
          expect(mockTimesheetConstructor.calledOnce).to.be.true;
          expect(mockTimesheetConstructor.calledWith({
            endDate: '2015-09-21'
          })).to.be.true;
          expect(mockTimesheet.$save.calledOnce).to.be.true;
          $rootScope.$digest();
        });
      });

      describe('if the cache is for a different user', function() {
        beforeEach(function() {
          timesheets.refresh();
          queryDfd.resolve(testData);
          $rootScope.$digest();
          mockTimesheetConstructor.query.reset();
          mockIdentity.currentUser = {
            _id: 42,
            name: 'Douglas Adams'
          };
        });

        it('queries the timesheets for given end date', function(done) {
          mockDateUtilities.weekEndDate.returns(new Date(2015, 8, 21));
          timesheets.getCurrent().then(function(current) {
            expect(current).to.deep.equal({
              _id: 42,
              endDate: '2015-09-21'
            });
            done();
          });

          expect(mockTimesheetConstructor.query.calledOnce).to.be.true;
          expect(mockTimesheetConstructor.query.calledWith({
            endDate: '2015-09-21'
          })).to.be.true;
          mockTimesheetConstructor.query.yield([{
            _id: 42,
            endDate: '2015-09-21'
          }]);
          $rootScope.$digest();
        });

        it('resolves a new timesheet if not found', function(done) {
          mockDateUtilities.weekEndDate.returns(new Date(2015, 8, 21));
          timesheets.getCurrent().then(function(current) {
            expect(current).to.equal(mockTimesheet);
            done();
          });

          mockTimesheetConstructor.query.yield([]);
          expect(mockTimesheetConstructor.calledOnce).to.be.true;
          expect(mockTimesheetConstructor.calledWith({
            endDate: '2015-09-21'
          })).to.be.true;
          expect(mockTimesheet.$save.calledOnce).to.be.true;
          $rootScope.$digest();
        });
      });
    });

    describe('refresh', function() {
      it('queries the timesheets regardless of cache', function() {
        timesheets.refresh();
        timesheets.refresh();
        expect(mockTimesheetConstructor.query.calledTwice).to.be.true;
      });

      it('caches the results', function() {
        timesheets.refresh();
        var allTimesheets = timesheets.all;
        expect(mockTimesheetConstructor.query.calledOnce).to.be.true;
      });
    });

    function initializeTestData() {
      testData = [{
        _id: 1,
        endDate: '2015-09-15'
      }, {
        _id: 2,
        endDate: '2015-09-21'
      }, {
        _id: 6,
        endDate: '2015-10-01'
      }, {
        _id: 5,
        endDate: '2015-08-13'
      }, {
        _id: 3,
        endDate: '2015-08-06'
      }, {
        _id: 4,
        endDate: '2015-09-08'
      }, {
        _id: 8,
        endDate: '2015-07-05'
      }, {
        _id: 6,
        endDate: '2015-07-13'
      }];
    }
  });
}());
