(function() {
  'use strict';

  describe('timeReportController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.reports.timeReport.timeReportController'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('timeReportController', {});
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.exist;
    });
  });
}());