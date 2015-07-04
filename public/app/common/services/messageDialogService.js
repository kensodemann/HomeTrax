(function() {
  'use strict';

  angular.module('app.core').factory('messageDialogService', MessageDialogService);

  function MessageDialogService($modal, $rootScope, $q) {
    var exports = {
      ask: function(question, title) {
        askDfd = $q.defer();
        askScope.question = question;
        askScope.title = title;
        askDlg.$promise.then(function() {
          askDlg.show();
        });
        return askDfd.promise;
      }
    };

    var askDfd;
    var askScope = $rootScope.$new(true);
    var askDlg = $modal({
      template: 'app/common/templates/askDialog.html',
      backdrop: 'static',
      show: false,
      scope: askScope
    });

    askScope.yes = function() {
      askDfd.resolve(true);
      askDlg.hide();
    };

    askScope.no = function() {
      askDfd.resolve(false);
      askDlg.hide();
    };

    return exports;
  }
}());
