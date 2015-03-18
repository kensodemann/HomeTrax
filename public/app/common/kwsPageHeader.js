(function() {
  'use strict';

  angular.module('app.core').directive('kwsPageHeader', kwsPageHeader);

  function kwsPageHeader() {
    return {
      restrict: 'AE',
      scope: {
        kwsTitle: '@',
        kwsSubTextLines: '='
      },
      templateUrl: '/partials/common/templates/kwsPageHeader'
    };
  }
}());