(function() {
  'use strict';

  describe('currencyAmount', function() {
    var scope;
    var el;

    beforeEach(module('app.core'));

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;
      el = angular.element('<form name="myForm"><input name="myAmount" ng-model="theAmount" currency-amount/></form>');
      $compile(el)(scope);
      scope.$digest();
    }));

    describe('using valid amounts', function() {
      it('sets the input valid if the value is empty', function() {
        scope.theAmount = '';
        scope.$digest();
        expect(scope.myForm.myAmount.$invalid).to.be.false;
        expect(scope.myForm.myAmount.$error.currencyAmount).to.be.undefined;
      });

      it('sets the input valid if the value is an integer', function() {
        scope.theAmount = '1';
        scope.$digest();
        expect(scope.myForm.myAmount.$invalid).to.be.false;
        expect(scope.myForm.myAmount.$error.currencyAmount).to.be.undefined;
      });

      it('sets the input valid if the value has zero digits in the mantissa', function() {
        scope.theAmount = '314.';
        scope.$digest();
        expect(scope.myForm.myAmount.$invalid).to.be.false;
        expect(scope.myForm.myAmount.$error.currencyAmount).to.be.undefined;
      });

      it('sets the input valid if the value has one digits in the mantissa', function() {
        scope.theAmount = '314.1';
        scope.$digest();
        expect(scope.myForm.myAmount.$invalid).to.be.false;
        expect(scope.myForm.myAmount.$error.currencyAmount).to.be.undefined;
      });

      it('sets the input valid if the value has two digits in the mantissa', function() {
        scope.theAmount = '314.12';
        scope.$digest();
        expect(scope.myForm.myAmount.$invalid).to.be.false;
        expect(scope.myForm.myAmount.$error.currencyAmount).to.be.undefined;
      });

      it('sets the input valid if the value has only digits in the mantissa', function() {
        scope.theAmount = '.12';
        scope.$digest();
        expect(scope.myForm.myAmount.$invalid).to.be.false;
        expect(scope.myForm.myAmount.$error.currencyAmount).to.be.undefined;
      });
    });

    describe('using invalid amounts', function() {
      it('sets the input invalid if the value is a string', function() {
        scope.theAmount = 'bad';
        scope.$digest();
        expect(scope.myForm.myAmount.$invalid).to.be.true;
        expect(scope.myForm.myAmount.$error.currencyAmount).to.be.true;
      });

      it('sets the input invalid if the mantissa has too many digits', function() {
        scope.theAmount = '1234.325';
        scope.$digest();
        expect(scope.myForm.myAmount.$invalid).to.be.true;
        expect(scope.myForm.myAmount.$error.currencyAmount).to.be.true;
      });
    });
  });
}());