angular.module('app').value('trxToastr', toastr);

angular.module('app').factory('trxNotifier', function(trxToastr) {
  return {
    notify: function(msg) {
      trxToastr.success(msg);
      console.log(msg);
    },
    
    error: function(msg) {
      trxToastr.error(msg);
      console.log(msg);
    }
  }
})