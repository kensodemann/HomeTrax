(function() {
  'use strict';

  describe('kwsPageHeader', function() {
    var compile;
    var scope;
    var el;

    beforeEach(module('/partials/common/templates/kwsPageHeader'));
    beforeEach(module('app.core'));

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;
      compile = $compile;
    }));

    describe('Basic Rendering', function() {
      beforeEach(function() {
        scope.lines = [{
          template: 'Killswitch',
          modes: 'EV'
        }, {
          template: 'line 1',
          modes: 'EV'
        }, {
          template: 'line 2',
          modes: 'EV'
        }, {
          template: 'line 3',
          modes: 'EV'
        }];
        el = angular.element('<kws-page-header kws-lines="lines"></kws-page-header>');
        compile(el)(scope);
        scope.$digest();
      });

      it('Renders', function() {
        expect(el[0].innerHTML).to.contain('<div class="jumbotron');
      });

      it('Renders the first line as the title', function() {
        expect(el[0].innerHTML).to.contain('><kws-templated-view kws-model="kwsModel" kws-template="Killswitch"></kws-templated-view></h2>');
      });

      it('Renders the rest as subtext, one per line', function() {
        var re = /kws-template="line 1"><\/kws-templated-view>.*kws-template="line 2"><\/kws-templated-view>.*kws-template="line 3"><\/kws-templated-view>/;
        expect(re.test(el[0].innerHTML)).to.be.true;
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

      it('is set to the column value for nodes associated with a column', function() {
        expect(scope.lines[1].template).to.equal('{{kwsModel.lastName}}, {{kwsModel.firstName}}');
      });

      it('is not set if the line is not used in View mode', function() {
        expect(scope.lines[2].template).to.be.undefined;
      });
    });

    describe('Edit Template', function() {
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

      it('is set to the column value for nodes associated with a column', function() {
        expect(scope.lines[1].editTemplate).to.equal('{{kwsModel.lastName}}, {{kwsModel.firstName}}');
      });

      it('is not set if the line is not used in Edit mode', function() {
        expect(scope.lines[2].editTemplate).to.be.undefined;
      });
    });

    describe('Bad Lines', function() {
      it('raises an error ', function(done) {
        scope.lines = [{value: 'this is bogus', modes: 'V'}];
        el = angular.element('<kws-page-header kws-lines="lines"></kws-page-header>');
        try {
          compile(el)(scope);
          scope.$digest();
        } catch (err) {
          expect(err.message).to.equal('Must have a template or a column name');
          done();
        }
      });
    });
  });
}());