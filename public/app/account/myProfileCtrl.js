(function() {
  'use strict';

  angular.module('app.account').controller('myProfileCtrl', MyProfileCtrl);

  function MyProfileCtrl(User, identity, passwordEditor) {
    var self = this;

    self.user = currentUser();

    self.reset = function() {
      self.user = currentUser();
    };

    self.save = function() {
      self.user.$update();
    };

    self.openPasswordEditor = function(){
      passwordEditor.open(identity.currentUser._id);
    };

    function currentUser(){
      return User.get({
        id: identity.currentUser._id
      });
    }
  }
}());