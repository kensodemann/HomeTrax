/* global angular */
angular.module('app.account', ['ngResource']);
angular.module('app.calendar', ['app.core', 'ngResource']);
angular.module('app.core', []);
angular.module('app.financial', ['app.core', 'ngResource']);
angular.module('app.household', ['ngResource']);
angular.module('app', ['ngResource']);
var toastr = {};