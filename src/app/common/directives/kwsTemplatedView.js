(function() {
  'use strict';

  angular.module('app').directive('kwsTemplatedView', KwsTemplatedView);

  function KwsTemplatedView($compile) {
    return {
      restrict: 'E',
      scope: {
        kwsModel: '=',
        kwsTemplate: '@'
      },
      link: link
    };

    function link(scope, element) {
      element.html(scope.kwsTemplate).show();
      $compile(element.contents())(scope);
    }
  }
}());