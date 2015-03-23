(function() {
  'use strict';

  describe('kwsTemplatedView', function() {
    var compile;
    var scope;

    beforeEach(module('app'));

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;
      compile = $compile;
    }));

    it('Should render correctly', function() {
      scope.myModel = {
        name: 'I am name'
      };
      scope.myTemplate = "<div>{{kwsModel.name}}</div>";
      var el = angular.element('<kws-templated-view kws-model="myModel" kws-template="{{myTemplate}}"/></kws-templated-view>');
      compile(el)(scope);
      scope.$digest();

      expect(el[0].innerHTML).to.contain('<div class="ng-binding ng-scope">I am name</div>');
    });
  });
}());