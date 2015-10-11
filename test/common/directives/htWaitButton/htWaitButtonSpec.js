(function() {
  'use strict';

  describe('homeTrax.common.directives.htWaitButton: htWaitButton', function() {
    var $rootScope;
    var $compile;
    var $q;

    beforeEach(module('homeTrax.common.directives.htWaitButton'));
    beforeEach(module('app/common/directives/htWaitButton/htWaitButton.html'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$q_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $q = _$q_;
    }));

    it('should render correctly with no click attribute', function() {
      var $scope = $rootScope.$new();
      var e = $compile('<ht-wait-button></ht-wait-button>')($scope);
      $scope.$digest();
      e.click();
    });

    it('should render correctly with bad click attribute', function() {
      var $scope = $rootScope.$new();
      var e = $compile('<ht-wait-button wait-click="clickNow()"></ht-wait-button>')($scope);
      $scope.$digest();
      e.click();
    });

    it('should call wait-click attribute', function(done) {
      var $scope = $rootScope.$new();
      $scope.controller = {
        clickNow: function() {
          done();
        }
      };

      var e = $compile('<ht-wait-button wait-click="controller.clickNow()"></ht-wait-button>')($scope);
      $scope.$digest();
      e.click();
    });

    it('should call wait-click attribute and wait for promise', function(done) {
      var resolver = new Resolver();
      var $scope = $rootScope.$new();

      $scope.controller = {
        clickNow: function() {
          return $q(resolver.resolver);
        }
      };

      var e = $compile('<ht-wait-button wait-click="controller.clickNow()"></ht-wait-button>')($scope);
      $scope.$digest();
      expect(e.isolateScope().controller.waitBusy).to.be.false;
      e.click();
      expect(e.isolateScope().controller.waitBusy).to.be.true;
      resolver.resolveMe();
      $scope.$digest();
      expect(e.isolateScope().controller.waitBusy).to.be.false;
      done();
    });

    it('should stop being busy on rejected promise', function(done) {
      var resolver = new Resolver();
      var $scope = $rootScope.$new();

      $scope.controller = {
        clickNow: function() {
          return $q(resolver.resolver);
        }
      };

      var e = $compile('<ht-wait-button wait-click="controller.clickNow()"></ht-wait-button>')($scope);
      $scope.$digest();
      expect(e.isolateScope().controller.waitBusy).to.be.false;
      e.click();
      expect(e.isolateScope().controller.waitBusy).to.be.true;
      resolver.rejectMe();
      $scope.$digest();
      expect(e.isolateScope().controller.waitBusy).to.be.false;
      done();
    });

    it('should stop being busy when an exception is thrown', function(done) {
      var $scope = $rootScope.$new();

      $scope.controller = {
        clickNow: function() {
          var dynamite;
          dynamite.boom;
        }
      };

      var e = $compile('<ht-wait-button wait-click="controller.clickNow()"></ht-wait-button>')($scope);
      $scope.$digest();
      expect(e.isolateScope().controller.waitBusy).to.be.false;

      /*jshint -W002 */
      try {
        e.click();
      } catch (e) {
      }
      /*jshint +W002 */
      expect(e.isolateScope().controller.waitBusy).to.be.false;
      done();
    });

    function Resolver() {

      var resolve;
      var reject;

      this.resolver = function(resolveVal, rejectVal) {
        resolve = resolveVal;
        reject = rejectVal;
      };

      this.resolveMe = function() {
        resolve();
      };

      this.rejectMe = function() {
        reject();
      };
    }

  });
}());
