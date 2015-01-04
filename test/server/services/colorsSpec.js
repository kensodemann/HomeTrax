/* global describe it */
'use strict';

var expect = require('chai').expect;
var colors = require('../../../server/services/colors');

describe('colors', function() {
  describe('user pallets', function() {
    it('contains six pallets', function() {
      expect(colors.userPallets.length).to.equal(6);
    });

    it('has four items per pallet', function() {
      colors.userPallets.forEach(function(pallet) {
        expect(pallet.length).to.equal(4);
      });
    });

    it('consists of colors', function() {
      var colorRE = /^#[0-9a-fA-F]{6}$/;
      colors.userPallets.forEach(function(pallet) {
        pallet.forEach(function(item) {
          expect(colorRE.test(item)).to.be.true;
        });
      });
    });
  });
});