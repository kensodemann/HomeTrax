'use strict';

var _ = require('underscore');
var db = require('../config/database');
var error = require('../services/error');
var ObjectId = require('mongojs').ObjectId;
var Q = require('q');

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
    if (!!err) {
      return error.send(err, res);
    }
    if (!a) {
      res.status(404);
    }
    res.send(a);
  });
};

module.exports.save = function(req, res) {
  assignIdFromRequest();
  convertReferenceIds();
  if (dataIsValid(req, res)) {
    actionIsValid(req).done(performSave, sendError);
  }

  function assignIdFromRequest() {
    if (req.params && req.params.id) {
      req.body._id = new ObjectId(req.params.id);
    } else {
      req.body_id = undefined;
    }
  }

  function convertReferenceIds() {
    if (!!req.body.entityRid) {
      req.body.entityRid = new ObjectId(req.body.entityRid);
    }
  }

  function performSave() {
    db.accounts.save(req.body, function(err, a) {
      if (!!err) {
        return error.send(err, res);
      }
      if (!req.params || !req.params.id) {
        res.status(201);
      }
      res.send(a);
    });
  }

  function sendError(stat) {
    res.status(stat);
    res.end();
  }
};

module.exports.remove = function(req, res) {
  actionIsValid(req).then(removeAccount, sendError);

  function removeAccount() {
    db.accounts.remove({_id: new ObjectId(req.params.id)}, function(err) {
      if (!!err) {
        return error.send(err, res);
      }
      db.events.remove({accountRid: new ObjectId(req.params.id)}, function(err) {
        if (!!err) {
          return error.send(err, res);
        }
        res.send();
      });
    });
  }

  function sendError(stat) {
    res.status(stat);
    res.end();
  }
};

function dataIsValid() {
  return true;
}

function actionIsValid(req) {
  var dfd = Q.defer();
  if (!req.params || !req.params.id) {
    dfd.resolve(true);
  }
  else {
    db.accounts.findOne({
      _id: new ObjectId(req.params.id)
    }, function(err, a) {
      if (!a) {
        return dfd.reject(404);
      }
      dfd.resolve(true);
    });
  }
  return dfd.promise;
}

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