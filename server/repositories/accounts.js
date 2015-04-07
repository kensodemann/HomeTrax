'use strict';

var _ = require('underscore');
var db = require('../config/database');
var error = require('../services/error');
var ObjectId = require('mongojs').ObjectId;

function assignBalances(accts, done) {
  db.events.aggregate([{
    $group: {
      _id: "$accountRid",
      numberOfTransactions: {$sum: 1},
      principalPaid: {$sum: "$principalAmount"},
      interestPaid: {$sum: "$interestAmount"}
    }
  }], function(err, e) {
    accts.forEach(function(acct) {
      var ttls = _.find(e, function(item) {
        return e._id === item.entityRid;
      });
      if (!!ttls) {
        acct.numberOfTransactions = ttls.numberOfTransactions;
        acct.principalPaid = ttls.principalPaid * -1;
        acct.interestPaid = ttls.interestPaid * -1;
      }
    });
    done();
  });
}

module.exports.get = function(req, res) {
  db.accounts.find({}, function(err, a) {
    if (err) {
      return error.send(err, res);
    }
    assignBalances(a, function() {
      res.send(a);
    });
  });
};

module.exports.getOne = function(req, res) {
  var id = new ObjectId(req.params.id);
  db.accounts.findOne({_id: id}, function(err, a) {
    if (err) {
      return error.send(err, res);
    }
    if (!a) {
      res.status(404);
    }
    res.send(a);
  });
};
