(function() {
  'use strict';

  describe('kwsDefinitionListPanel', function() {
    var compile;
    var scope;
    var el;

    beforeEach(module('/partials/common/templates/kwsDefinitionListPanel'));
    beforeEach(module('app.core'));

    beforeEach(inject(function($rootScope, $compile) {
      compile = $compile;
      scope = $rootScope;
    }));

    describe('Basic Rendering', function() {
      beforeEach(function() {
        scope.myModel = {
          foo: 'Value 1',
          bar: 'Value 3',
          snafu: 'Value 5'
        };
        scope.lists = [[{
          label: 'Label 1',
          columnName: 'foo'
        }, {
          label: 'Label 2',
          template: 'Value 2'
        }], [{
          label: 'Label 3',
          columnName: 'bar'
        }, {
          label: 'Label 4',
          template: 'Value 4'
        }, {
          label: 'Label 5',
          columnName: 'snafu'
        }]];
        el = angular.element('<kws-definition-list-panel kws-title="I Am Title" kws-lists="lists" kws-model="myModel"></kws-definition-list-panel>');
        compile(el)(scope);
        scope.$digest();
      });

      it('renders', function() {
        expect(el[0].innerHTML).to.contain('<div class="panel panel-default"');
      });

      it('renders the title', function() {
        expect(el[0].innerHTML).to.contain('<div class="panel-heading"><h3 class="panel-title ng-binding">I Am Title</h3>');
      });

      it('renders the lists', function() {
        var re = /<dl.*Label 1<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="\{\{kwsModel.foo\}\}"><\/kws-templated-view><\/dd>.*Label 2<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="Value 2"><\/kws-templated-view><\/dd>.*Label 3<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="\{\{kwsModel.bar\}\}"><\/kws-templated-view><\/dd>.*Label 4<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="Value 4"><\/kws-templated-view><\/dd>.*Label 5<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="\{\{kwsModel.snafu\}\}"><\/kws-templated-view><\/dd>.*<\/dl>/;
        expect(re.test(el[0].innerHTML)).to.be.true;
      });
    });

    describe('Template', function() {
      beforeEach(function() {
        scope.myModel = {
          firstName: 'Peter',
          lastName: 'Piper',
          address: '123 South Main Street'
        };
        scope.lists = [[{
          columnName: 'address'
        }, {
          template: '{{kwsModel.lastName}}, {{kwsModel.firstName}}'
        }]];
        el = angular.element('<kws-definition-list-panel kws-title="I Am Title" kws-lists="lists" kws-model="myModel"></kws-definition-list-panel>');
        compile(el)(scope);
        scope.$digest();
      });

      it('is generated if it is not specified', function() {
        expect(scope.lists[0][0].template).to.equal('{{kwsModel.address}}');
      });

      it('is set to the column value for nodes associated with a column', function() {
        expect(scope.lists[0][1].template).to.equal('{{kwsModel.lastName}}, {{kwsModel.firstName}}');
      });
    });

    describe('Bad Items', function(){
      it('raises an error ', function(done){
        scope.lists = [[{value: 'this is bogus'}]];
        el = angular.element('<kws-definition-list-panel kws-lists="lists"></kws-definition-list-panel>');
        try{
          compile(el)(scope);
          scope.$digest();
        } catch(err){
          expect(err.message).to.equal('Must have a template or a column name');
          done();
        }
      });
    });
  });
}());