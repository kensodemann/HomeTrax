angular.module('app').value('myToastr', toastr);

angular.module('app').factory('notifier', function(myToastr) {
  return {
    notify: function(msg) {
      myToastr.success(msg, null, {
        showMethod: "slideDown",
        positionClass: "toast-bottom-right"
      });
      console.log(msg);
    },

    error: function(msg) {
      myToastr.error(msg, null, {
        showMethod: "slideDown",
        positionClass: "toast-bottom-right"
      });
      console.log(msg);
    }
  }
})