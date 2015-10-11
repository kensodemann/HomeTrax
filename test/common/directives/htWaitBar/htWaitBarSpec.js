(function() {
  'use strict';

  describe('homeTrax.common.directives.htWaitBar: htWaitBar', function() {
    var $rootScope;
    var $compile;
    var $q;
    var $interval;

    beforeEach(module('homeTrax.common.directives.htWaitBar'));
    beforeEach(module('app/common/directives/htWaitBar/htWaitBar.html'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$q_, _$interval_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $q = _$q_;
      $interval = _$interval_;
    }));

    it('should delay 500 ms before becoming visible', function(done) {
      var $scope = $rootScope.$new();
      $scope.waiting = true;

      var e = $compile('<ht-wait-bar waiting="waiting"></ht-wait-bar>')($scope);
      $scope.$digest();
      expect(e.isolateScope().controller.internalWaiting).to.be.false;
      expect(e.isolateScope().controller.stop).to.be.exist;

      $interval.flush(500);
      expect(e.isolateScope().controller.internalWaiting).to.be.true;
      expect(e.isolateScope().controller.stop).to.be.undefined;

      $scope.waiting = false;
      $scope.$digest();
      expect(e.isolateScope().controller.internalWaiting).to.be.false;
      expect(e.isolateScope().controller.stop).to.be.undefined;

      done();
    });

    it('should cancel interval if stops waiting before delay', function(done) {
      var $scope = $rootScope.$new();
      $scope.waiting = true;

      var e = $compile('<ht-wait-bar waiting="waiting"></ht-wait-bar>')($scope);

      $scope.$digest();
      expect(e.isolateScope().controller.internalWaiting).to.be.false;

      $interval.flush(400);
      expect(e.isolateScope().controller.internalWaiting).to.be.false;
      expect(e.isolateScope().controller.stop).to.be.exist;

      $scope.waiting = false;
      $scope.$digest();
      expect(e.isolateScope().controller.internalWaiting).to.be.false;
      expect(e.isolateScope().controller.stop).to.be.undefined;

      done();
    });

    it('should cancel interval on scope destroy', function(done) {
      var $scope = $rootScope.$new();
      $scope.waiting = true;

      var e = $compile('<ht-wait-bar waiting="waiting"></ht-wait-bar>')($scope);

      $scope.$digest();
      expect(e.isolateScope().controller.internalWaiting).to.be.false;

      $interval.flush(400);
      expect(e.isolateScope().controller.internalWaiting).to.be.false;
      expect(e.isolateScope().controller.stop).to.be.exist;

      $scope.$destroy();
      expect(e.isolateScope().controller.internalWaiting).to.be.false;
      expect(e.isolateScope().controller.stop).to.be.undefined;

      done();
    });
  });
}());
