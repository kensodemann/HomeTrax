/* global angular */
(function() {
  'use strict';

  angular.module('app.household').controller('householdCtrl', HouseholdCtrl);

  function HouseholdCtrl() {
    var self = this;

    self.household = {
      name: 'My Condo',
      addressLine1: '2422 Fox River Pkwy',
      addressLine2: 'Unit F',
      city: 'Waukesha',
      state: 'WI',
      postal: '53189',
      phone: '(920) 988-4261'
    };

    self.tabs = [{
      "title": "Home",
      "content": "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica."
    }, {
      "title": "Profile",
      "content": "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee."
    }, {
      "title": "About",
      "content": "Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade."
    }];
    self.tabs.activeTab = 1;
  }
}());