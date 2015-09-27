(function() {
  'use strict';

  angular.module('homeTrax.common.services').value('myToastr', toastr);

  angular.module('homeTrax.common').factory('notifier', Notifier);

  function Notifier($log, myToastr) {
    return {
      notify: notify,
      error: error
    };

    function notify(msg) {
      myToastr.success(msg, null, {
        showMethod: 'slideDown',
        positionClass: 'toast-bottom-right'
      });
      $log.info(msg);
    }

    function error(msg) {
      myToastr.error(msg, null, {
        showMethod: 'slideDown',
        positionClass: 'toast-bottom-right'
      });
      $log.error(msg);
    }
  }
}());