(function() {
  'use strict';

  describe('kwsPageHeader', function() {
    var compile;
    var scope;
    var el;

    beforeEach(module('app/common/templates/kwsPageHeader.html'));
    beforeEach(module('app.core'));

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;
      compile = $compile;
    }));

    describe('Basic Rendering', function() {
      beforeEach(function() {
        scope.lines = [{
          template: 'Killswitch',
          modes: 'V'
        }, {
          template: 'line 1',
          modes: 'V'
        }, {
          template: 'line 2',
          modes: 'V'
        }, {
          template: 'line 3',
          modes: 'V'
        }];
        el = angular.element('<kws-page-header kws-lines="lines"></kws-page-header>');
        compile(el)(scope);
        scope.$digest();
      });

      it('Renders', function() {
        expect(el[0].innerHTML).to.contain('<div class="jumbotron');
      });

      it('Renders the first line as the title', function() {
        expect(el[0].innerHTML).to.contain('<kws-templated-view kws-model="kwsModel" kws-template="Killswitch"></kws-templated-view>');
      });
    });

    describe('View Mode Template', function() {
      beforeEach(function() {
        scope.myModel = {
          firstName: 'Peter',
          lastName: 'Piper',
          address: '123 South Main Street',
          city: 'Hamelin'
        };
        scope.lines = [{
          columnName: 'address',
          modes: 'EV'
        }, {
          columnName: 'lastName',
          template: '{{kwsModel.lastName}}, {{kwsModel.firstName}}',
          modes: 'V'
        }, {
          columnName: 'city',
          modes: 'E'
        }];
        el = angular.element('<kws-page-header kws-lines="lines" kws-model="myModel"></kws-page-header>');
        compile(el)(scope);
        scope.$digest();
      });

      it('is generated if it is not specified', function() {
        expect(scope.lines[0].template).to.equal('{{kwsModel.address}}');
      });

      it('keeps the existing template if specified', function() {
        expect(scope.lines[1].template).to.equal('{{kwsModel.lastName}}, {{kwsModel.firstName}}');
      });

      it('is not set if the line is not used in View mode', function() {
        expect(scope.lines[2].template).to.be.undefined;
      });
    });

    describe('Edit Mode Template', function() {
      beforeEach(function() {
        scope.myModel = {
          firstName: 'Peter',
          lastName: 'Piper',
          address: '123 South Main Street',
          city: 'Hamelin'
        };
        scope.lines = [{
          columnName: 'address',
          modes: 'EV'
        }, {
          columnName: 'lastName',
          editTemplate: '{{kwsModel.lastName}}, {{kwsModel.firstName}}',
          modes: 'E'
        }, {
          columnName: 'city',
          modes: 'V'
        }];
        el = angular.element('<kws-page-header kws-lines="lines" kws-model="myModel"></kws-page-header>');
        compile(el)(scope);
        scope.$digest();
      });

      it('is generated if it is not specified', function() {
        expect(scope.lines[0].editTemplate).to.equal(
           '<input class="form-control" name="address" ng-model="kwsModel[\'address\']">');
      });

      it('keeps the existing template if specified', function() {
        expect(scope.lines[1].editTemplate).to.equal('{{kwsModel.lastName}}, {{kwsModel.firstName}}');
      });

      it('is not set if the line is not used in Edit mode', function() {
        expect(scope.lines[2].editTemplate).to.be.undefined;
      });
    });

    describe('Bad Lines', function() {
      it('raises an error if no view template and no column name', function(done) {
        scope.lines = [{value: 'this is bogus', modes: 'V'}];
        el = angular.element('<kws-page-header kws-lines="lines"></kws-page-header>');
        try {
          compile(el)(scope);
          scope.$digest();
        } catch (err) {
          expect(err.message).to.equal('Must have a view template or a column name');
          done();
        }
      });

      it('raises an error if no edit template and no column name', function(done) {
        scope.lines = [{value: 'this is bogus', modes: 'E'}];
        el = angular.element('<kws-page-header kws-lines="lines"></kws-page-header>');
        try {
          compile(el)(scope);
          scope.$digest();
        } catch (err) {
          expect(err.message).to.equal('Must have an edit template or a column name');
          done();
        }
      });
    });
  });
}());