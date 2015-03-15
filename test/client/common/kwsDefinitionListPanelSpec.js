(function() {
  'use strict';

  describe('kwsDefinitionListPanel', function() {
    var scope;
    var el;

    beforeEach(module('/partials/common/templates/kwsDefinitionListPanel'));
    beforeEach(module('app.core'));

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;
      scope.lists = [[{
        label: 'Label 1',
        value: 'Value 1'
      }, {
        label: 'Label 2',
        value: 'Value 2'
      }], [{
        label: 'Label 3',
        value: 'Value 3'
      }, {
        label: 'Label 4',
        value: 'Value 4'
      }, {
        label: 'Label 5',
        value: 'Value 5'
      }]];
      el = angular.element('<kws-definition-list-panel kws-title="I Am Title" kws-lists="lists"></kws-definition-list-panel>');
      $compile(el)(scope);
      scope.$digest();
    }));

    it('renders', function() {
      expect(el[0].innerHTML).to.contain('<div class="panel panel-default"');
    });

    it('renders the title', function() {
      expect(el[0].innerHTML).to.contain('<div class="panel-heading"><h3 class="panel-title ng-binding">I Am Title</h3>');
    });

    it.only('renders the lists', function() {
      var re = /<dl.*Label 1<\/dt>.*Value 1<\/dd>.*Label 2<\/dt>.*Value 2<\/dd>.*<\/dl>.*<dl.*Label 3<\/dt>.*Value 3<\/dd>.*Label 4<\/dt>.*Value 4<\/dd>.*Label 5<\/dt>.*Value 5<\/dd>.*<\/dl>/;
      expect(re.test(el[0].innerHTML)).to.be.true;
    });
  });
}());