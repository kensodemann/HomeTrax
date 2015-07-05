(function() {
  'use strict';

  describe('isOnOrAfterDateSpec', function() {
    var scope;
    var el;

    beforeEach(module('app.core'));

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      el = angular.element('<form name="myForm"><input name="myDate" ng-model="theDate" is-on-or-after-date="{{targetDate}}"/></form>');
      $compile(el)(scope);
      scope.$digest();
    }));

    describe('Using Valid Dates and default formats', function() {
      it('Sets the input invalid if before target dateTime', function() {
        scope.theDate = '09/16/2014 9:00 AM';
        scope.targetDate = '09/16/2014 9:01 AM';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.true;
      });

      it('Sets the input valid if on target dateTime', function() {
        scope.theDate = '09/16/2014 9:01 AM';
        scope.targetDate = '09/16/2014 9:01 AM';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.false;
      });

      it('Sets the input valid if after target dateTime', function() {
        scope.theDate = '09/16/2014 9:02 AM';
        scope.targetDate = '09/16/2014 9:01 AM';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.false;
      });

      it('Sets the input invalid if before target date', function() {
        scope.theDate = '09/15/2014';
        scope.targetDate = '09/16/2014';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.true;
      });

      it('Sets the input valid if on target date', function() {
        scope.theDate = '09/16/2014';
        scope.targetDate = '09/16/2014';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.false;
      });

      it('Sets the input valid if after target date', function() {
        scope.theDate = '09/17/2014';
        scope.targetDate = '09/16/2014';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.false;
      });
    });

    describe('Using Valid Dates and alternate formats', function() {
      beforeEach(function() {
        scope.$parent.dateFormat = 'YYYY/MM/DD';
        scope.$parent.dateTimeFormat = 'DD/MM/YYYY h:mm A';
      });

      it('Sets the input invalid if before target dateTime', function() {
        scope.theDate = '16/09/2014 9:00 AM';
        scope.targetDate = '16/09/2014 9:01 AM';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.true;
      });

      it('Sets the input valid if on target dateTime', function() {
        scope.theDate = '16/09/2014 9:01 AM';
        scope.targetDate = '16/09/2014 9:01 AM';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.false;
      });

      it('Sets the input valid if after target dateTime', function() {
        scope.theDate = '16/09/2014 9:02 AM';
        scope.targetDate = '16/09/2014 9:01 AM';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.false;
      });

      it('Sets the input invalid if before target date', function() {
        scope.theDate = '2014/09/15';
        scope.targetDate = '2014/09/16';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.true;
      });

      it('Sets the input valid if on target date', function() {
        scope.theDate = '2014/09/16';
        scope.targetDate = '2014/09/16';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.false;
      });

      it('Sets the input valid if after target date', function() {
        scope.theDate = '2014/09/17';
        scope.targetDate = '2014/09/16';
        scope.$digest();

        expect(scope.myForm.myDate.$invalid).to.be.false;
      });
    });

    describe('the trigger', function() {
      it('detects a change in the model', function() {
        scope.theDate = '09/16/2014 9:01 AM';
        scope.targetDate = '09/16/2014 9:01 AM';
        scope.$digest();
        expect(scope.myForm.myDate.$invalid).to.be.false;
        scope.theDate = '09/16/2014 9:00 AM';
        scope.$digest();
        expect(scope.myForm.myDate.$invalid).to.be.true;
      });

      it('detects a change in the target', function() {
        scope.theDate = '09/16/2014 9:01 AM';
        scope.targetDate = '09/16/2014 9:01 AM';
        scope.$digest();
        expect(scope.myForm.myDate.$invalid).to.be.false;
        scope.targetDate = '09/16/2014 9:02 AM';
        scope.$digest();
        expect(scope.myForm.myDate.$invalid).to.be.true;
      });
    });
  });
}());