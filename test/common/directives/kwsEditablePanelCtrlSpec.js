(function() {
  'use strict';

  describe('kwsEditablePanelCtrl', function() {
    var scope;
    var $controllerConstructor;

    beforeEach(module('app.core'));

    beforeEach(inject(function($controller, $rootScope) {
      $controllerConstructor = $controller;
      scope = $rootScope.$new();
    }));

    function createController() {
      return $controllerConstructor('kwsEditablePanelCtrl', {
        $scope: scope
      });
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.not.be.undefined;
    });

    describe('Starting to edit', function() {
      it('Puts the directive in edit mode', function() {
        var ctrl = createController();
        ctrl.editClicked();
        expect(ctrl.editMode).to.be.true;
      });
    });

    describe('Cancel edit', function() {
      it('Take the directive out of edit mode', function() {
        var ctrl = createController();
        ctrl.editClicked();
        ctrl.cancelClicked();
        expect(ctrl.editMode).to.be.false;
      });

      it('restores the original model', function() {
        scope.kwsModel = {
          firstName: 'Fred',
          lastName: 'Flintstone'
        };
        var ctrl = createController();
        ctrl.editClicked();
        scope.kwsModel.firstName = 'Betty';
        scope.kwsModel.lastName = 'Rubble';
        ctrl.cancelClicked();
        expect(scope.kwsModel).to.deep.equal({
          firstName: 'Fred',
          lastName: 'Flintstone'
        });
      });
    });

    describe('Completing edit', function() {
      beforeEach(function() {
        scope.kwsModel = {
          firstName: 'Fred',
          lastName: 'Flintstone',
          $save: sinon.stub()
        };
      });

      it('saves the changes', function(){
        var ctrl = createController();
        ctrl.editClicked();
        scope.kwsModel.firstName = 'Betty';
        scope.kwsModel.lastName = 'Rubble';
        ctrl.doneClicked();
        expect(scope.kwsModel.firstName).to.equal('Betty');
        expect(scope.kwsModel.lastName).to.equal('Rubble');
        expect(scope.kwsModel.$save.calledOnce).to.be.true;
      });

      it('Take the directive out of edit mode once the save returns', function() {
        var ctrl = createController();
        ctrl.editClicked();
        ctrl.doneClicked();
        scope.kwsModel.$save.yield();
        expect(ctrl.editMode).to.be.false;
      });
    });
  });
}());