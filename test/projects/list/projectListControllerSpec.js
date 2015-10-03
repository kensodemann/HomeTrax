(function() {
  'use strict';

  describe('projectListController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.projects.list'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('projectListController', {});
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.exist;
    });
  });
}());