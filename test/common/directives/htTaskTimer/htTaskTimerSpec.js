(function() {
  'use strict';

  describe('homeTrax.common.directives.htTaskTimer: htTaskTimer', function() {
    var $compile;
    var scope;

    beforeEach(module('homeTrax.common.directives.htTaskTimer'));
    beforeEach(module('app/common/directives/htTaskTimer/htTaskTimer.html'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;
    }));

    it('compiles', function() {
      var el = compile('<ht-task-timer></ht-task-timer>');
      expect(el[0].innerHTML).to.contain('<div class="row taskTimer">');
    });

    function compile(html) {
      var el = angular.element(html);
      $compile(el)(scope);
      scope.$digest();

      return el;
    }
  });
}());