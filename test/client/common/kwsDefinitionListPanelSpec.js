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
          columnName: 'foo',
          modes: 'V'
        }, {
          label: 'Label 2',
          template: 'Value 2',
          modes: 'V'
        }], [{
          label: 'Label 3',
          columnName: 'bar',
          modes: 'V'
        }, {
          label: 'Label 4',
          template: 'Value 4',
          modes: 'V'
        }, {
          label: 'Label 5',
          columnName: 'snafu',
          modes: 'V'
        }]];
        el = angular.element('<kws-definition-list-panel kws-title="I Am Title" kws-lists="lists" kws-model="myModel"></kws-definition-list-panel>');
        compile(el)(scope);
        scope.$digest();
      });

      it('renders', function() {
        expect(el[0].innerHTML).to.contain('<div class="panel panel-default"');
      });

      it('renders the title', function() {
        expect(el[0].innerHTML).to.contain('<div class="panel-heading"><h3 class="panel-title ng-binding">I Am Title');
      });

      it('renders the lists', function() {
        var re = /<dl.*Label 1<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="\{\{kwsModel.foo\}\}"><\/kws-templated-view><\/dd>.*Label 2<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="Value 2"><\/kws-templated-view><\/dd>.*Label 3<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="\{\{kwsModel.bar\}\}"><\/kws-templated-view><\/dd>.*Label 4<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="Value 4"><\/kws-templated-view><\/dd>.*Label 5<\/dt>.*<dd><kws-templated-view kws-model="kwsModel" kws-template="\{\{kwsModel.snafu\}\}"><\/kws-templated-view><\/dd>.*<\/dl>/;
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
        scope.lists = [[{
          columnName: 'address',
          modes: 'EV'
        }, {
          columnName: 'firstName',
          template: '{{kwsModel.lastName}}, {{kwsModel.firstName}}',
          modes: 'V'
        }, {
          columnName: 'city',
          modes: 'E'
        }]];
        el = angular.element('<kws-definition-list-panel kws-title="I Am Title" kws-lists="lists" kws-model="myModel"></kws-definition-list-panel>');
        compile(el)(scope);
        scope.$digest();
      });

      it('is generated if it is not specified', function() {
        expect(scope.lists[0][0].template).to.equal('{{kwsModel.address}}');
      });

      it('keeps the existing template if specified', function() {
        expect(scope.lists[0][1].template).to.equal('{{kwsModel.lastName}}, {{kwsModel.firstName}}');
      });

      it('is not set if the line is not used in View mode', function() {
        expect(scope.lists[0][2].template).to.be.undefined;
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
        scope.lists = [[{
          columnName: 'address',
          modes: 'EV'
        }, {
          columnName: 'firstName',
          editTemplate: '{{kwsModel.lastName}}, {{kwsModel.firstName}}',
          modes: 'E'
        }, {
          columnName: 'city',
          modes: 'V'
        }]];
        el = angular.element('<kws-definition-list-panel kws-title="I Am Title" kws-lists="lists" kws-model="myModel"></kws-definition-list-panel>');
        compile(el)(scope);
        scope.$digest();
      });

      it('is generated if it is not specified', function() {
        expect(scope.lists[0][0].editTemplate).to.equal(
          '<input class="form-control" name="address" ng-model="kwsModel[\'address\']">');
      });

      it('keeps the existing template if specified', function() {
        expect(scope.lists[0][1].editTemplate).to.equal('{{kwsModel.lastName}}, {{kwsModel.firstName}}');
      });

      it('is not set if the line is not used in Edit mode', function() {
        expect(scope.lists[0][2].editTemplate).to.be.undefined;
      });
    });

    describe('Bad Items', function() {
      it('raises an error if no view template and no column name', function(done) {
        scope.lists = [[{value: 'this is bogus', modes: 'V'}]];
        el = angular.element('<kws-definition-list-panel kws-lists="lists"></kws-definition-list-panel>');
        try {
          compile(el)(scope);
          scope.$digest();
        } catch (err) {
          expect(err.message).to.equal('Must have a view template or a column name');
          done();
        }
      });

      it('raises an error if no edit template and no column name', function(done) {
        scope.lists = [[{value: 'this is bogus', modes: 'E'}]];
        el = angular.element('<kws-definition-list-panel kws-lists="lists"></kws-definition-list-panel>');
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