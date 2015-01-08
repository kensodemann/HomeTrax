/* global beforeEach describe expect inject it */
(function() {
  'use strict';

  describe('colors service', function() {
    var serviceUnderTest;

    beforeEach(module('app.core'));

    beforeEach(inject(function(colors) {
      serviceUnderTest = colors;
    }));

    it('exists', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

  });
})();