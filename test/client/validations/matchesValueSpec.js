/*jshint expr: true*/
(function() {
  'use strict';

  describe('matchesValue', function() {
    var scope;
    var el;

    beforeEach(module('app'));

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;
      el = angular.element('<form name="myForm"><input name="myElement" type="text" ng-model="value" matches-value="{{targetValue}}"/></form>');
      $compile(el)(scope);
      scope.$digest();
    }));

    it('marks input valid if values both undefined', function() {
      scope.$digest();
      expect(scope.myForm.myElement.$invalid).to.be.false;
    });

    it('marks input valid if values match', function() {
      scope.value = 'Foo';
      scope.targetValue = 'Foo';
      scope.$digest();
      expect(scope.myForm.myElement.$invalid).to.be.false;
    });

    it('marks input invalid if values do not match', function() {
      scope.value = 'Foo';
      scope.targetValue = 'Bar';
      scope.$digest();
      expect(scope.myForm.myElement.$invalid).to.be.true;
    });

    it('observes changes in the model', function() {
      scope.value = 'Foo';
      scope.targetValue = 'Foo';
      scope.$digest();
      expect(scope.myForm.myElement.$invalid).to.be.false;
      scope.value = 'Fool';
      scope.$digest();
      expect(scope.myForm.myElement.$invalid).to.be.true;
    });

    it('observes changes in the target', function() {
      scope.value = 'Foo';
      scope.targetValue = 'Foo';
      scope.$digest();
      expect(scope.myForm.myElement.$invalid).to.be.false;
      scope.targetValue = 'Fool';
      scope.$digest();
      expect(scope.myForm.myElement.$invalid).to.be.true;
    });
  });
}());