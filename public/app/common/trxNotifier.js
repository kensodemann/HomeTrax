angular.module('app').value('trxToastr', toastr);

angular.module('app').factory('trxNotifier', function(trxToastr) {
  return {
    notify: function(msg) {
      trxToastr.success(msg, null, {
        showMethod: "slideDown",
        positionClass: "toast-bottom-right"
      });
      console.log(msg);
    },

    error: function(msg) {
      trxToastr.error(msg, null, {
        showMethod: "slideDown",
        positionClass: "toast-bottom-right"
      });
      console.log(msg);
    }
  }
})