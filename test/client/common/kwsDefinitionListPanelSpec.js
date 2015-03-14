(function() {
  'use strict';

  describe('kwsDefinitionListPanel', function() {
    var scope;
    var el;

    beforeEach(module('app'));

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;
      el = angular.element('<form name="myForm"><input name="myElement" type="text" ng-model="value" directive="{{targetValue}}"/></form>');
      $compile(el)(scope);
      scope.$digest();
    }));

    //it('Should render correctly', function() {
    //  expect(el[0].innerHTML).to.contain('<div>Something unique</div>');
    //});
  });
}());