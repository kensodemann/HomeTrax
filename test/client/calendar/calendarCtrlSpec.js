'use strict'

describe('calendarCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var q;

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
    q = $q;
  }));

  it('exists', function() {
    var ctrl = $controllerConstructor('calendarCtrl', {
      $scope: scope,
      $modal: {}
    });

    expect(ctrl).to.not.be.undefined;
  });

  describe('initialization', function() {
    var mockEvent;

    beforeEach(function() {
      mockEvent = sinon.stub({
        query: function() {}
      });
    });

    it('gets the events', function() {
      $controllerConstructor('calendarCtrl', {
        $scope: scope,
        $modal: {},
        calendarEvent: mockEvent
      });

      expect(mockEvent.query.calledOnce).to.be.true;
    });
  });
});