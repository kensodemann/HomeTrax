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
          value: 'Value 2'
        }], [{
          label: 'Label 3',
          columnName: 'bar'
        }, {
          label: 'Label 4',
          value: 'Value 4'
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
        var re = /<dl.*Label 1<\/dt>.*Value 1<\/dd>.*Label 2<\/dt>.*Value 2<\/dd>.*<\/dl>.*<dl.*Label 3<\/dt>.*Value 3<\/dd>.*Label 4<\/dt>.*Value 4<\/dd>.*Label 5<\/dt>.*Value 5<\/dd>.*<\/dl>/;
        expect(re.test(el[0].innerHTML)).to.be.true;
      });
    });

    describe('Display Value', function() {
      beforeEach(function() {
        scope.myModel = {
          dateField: new Date(2015, 2, 17),
          numericField: 123456.4956,
          currencyField: 1234.457,
          stringField: 'I am string'
        };
        scope.lists = [[{
          label: 'Value Column',
          value: 'I am value'
        }, {
          label: 'Date column',
          columnName: 'dateField',
          dataType: 'date'
        }, {
          label: 'Numeric column',
          columnName: 'numericField',
          dataType: 'number'
        }, {
          label: 'Currency Column',
          columnName: 'currencyField',
          dataType: 'currency'
        }, {
          label: 'String Column',
          columnName: 'stringField',
          dataType: 'string'
        }, {
          label: 'String Column',
          columnName: 'stringField'
        }]];
        el = angular.element('<kws-definition-list-panel kws-title="I Am Title" kws-lists="lists" kws-model="myModel"></kws-definition-list-panel>');
        compile(el)(scope);
        scope.$digest();
      });

      it('is set to the value for value nodes', function() {
        expect(scope.lists[0][0].displayValue).to.equal('I am value');
      });

      it('is set to the short date format for a date', function(){
        expect(scope.lists[0][1].displayValue).to.equal('Mar 17, 2015');
      });

      it('is set to the number format for a number', function(){
        expect(scope.lists[0][2].displayValue).to.equal('123,456.496');
      });

      it('is set to the currency format for a currency value', function(){
        expect(scope.lists[0][3].displayValue).to.equal('$1,234.46');
      });

      it('is set to the value for a string value', function(){
        expect(scope.lists[0][4].displayValue).to.equal('I am string');
      });

      it('is set to the value for an undefined type value', function(){
        expect(scope.lists[0][5].displayValue).to.equal('I am string');
      });
    });
  });
}());