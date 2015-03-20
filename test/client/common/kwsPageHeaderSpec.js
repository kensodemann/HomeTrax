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
        scope.lines = [{value: 'Killswitch'}, {value: 'line 1'}, {value: 'line 2'}, {value: 'line 3'}];
        el = angular.element('<kws-page-header kws-lines="lines"></kws-page-header>');
        compile(el)(scope);
        scope.$digest();
      });

      it('Renders', function() {
        expect(el[0].innerHTML).to.contain('<div class="jumbotron');
      });

      it('Renders the first line as the title', function() {
        expect(el[0].innerHTML).to.contain('>Killswitch</h2>');
      });

      it('Renders the rest as subtext, one per line', function() {
        var re = />line 1<\/div>.*>line 2<\/div>.*>line 3<\/div>/;
        expect(re.test(el[0].innerHTML)).to.be.true;
      });
    });

    describe('Display Value', function() {
      beforeEach(function() {
        scope.myModel = {
          name: 'I am name',
          address: '123 South Main Street'
        };
        scope.lines = [{
          value: 'I am value'
        }, {
          columnName: 'name'
        }];
        el = angular.element('<kws-page-header kws-lines="lines" kws-model="myModel"></kws-page-header>');
        compile(el)(scope);
        scope.$digest();
      });

      it('is set to the value for value nodes', function() {
        expect(scope.lines[0].displayValue).to.equal('I am value');
      });

      it('is set to the column value for nodes associated with a column', function() {
        expect(scope.lines[1].displayValue).to.equal('I am name');
      });
    });
  });
}());