(function() {
  'use strict';

  describe('kwsPageHeader', function() {
    var scope;
    var el;

    beforeEach(module('/partials/common/templates/kwsPageHeader'));
    beforeEach(module('app.core'));

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;
      scope.subText = ['line 1', 'line 2', 'line 3'];
      el = angular.element('<kws-page-header kws-title="Killswitch" kws-sub-text-lines="subText"></kws-page-header>');
      $compile(el)(scope);
      scope.$digest();
    }));

    it('Renders', function() {
      expect(el[0].innerHTML).to.contain('<div class="jumbotron');
    });

    it('Renders the title', function() {
      expect(el[0].innerHTML).to.contain('<h2 class="text-center ng-binding">Killswitch</h2>');
    });

    it('Renders the subtext, one per line', function() {
      var re = />line 1<\/div>.*>line 2<\/div>.*>line 3<\/div>/;
      expect(re.test(el[0].innerHTML)).to.be.true;
    });
  });
}());