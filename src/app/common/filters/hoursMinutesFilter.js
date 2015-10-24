(function() {
  angular.module('homeTrax.common.filters')
    .filter('hoursMinutes', function() {
      return function(ms) {
        if (!ms) {
          return '';
        }

        var minutes = Math.floor(ms / (1000 * 60));
        var hours = Math.floor(minutes / 60);
        minutes = minutes - (hours * 60);

        var hoursString = hours.toString();
        var minutesString = (minutes < 10 ? '0' : '') + minutes.toString();

        return hoursString + ':' + minutesString;
      };
    });
})();
