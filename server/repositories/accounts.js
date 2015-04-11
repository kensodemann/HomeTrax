'use strict';

var _ = require('underscore');
var db = require('../config/database');
var error = require('../services/error');
var ObjectId = require('mongojs').ObjectId;
var Q = require('q');

function Accounts() {
  this.collection = db.accounts;
  this.criteria = {};
}

Accounts.prototype.get = function(req, res) {
  var my = this;

  my.collection.find(my.criteria, function(err, a) {
    if (err) {
      return error.send(err, res);
    }
    my.postGetAction(a, function(err, a) {
      if (err) {
        return error.send(err, res);
      }
      res.send(a);
    });
  });
};

Accounts.prototype.getOne = function(req, res) {
  var criteria = _.extend({}, this.criteria);
  criteria._id = new ObjectId(req.params.id);
  this.collection.findOne(criteria, function(err, a) {
    if (!!err) {
      return error.send(err, res);
    }
    if (!a) {
      res.status(404);
    }
    res.send(a);
  });
};

Accounts.prototype.save = function(req, res) {
  var my = this;

  assignIdFromRequest();
  my.preSaveAction(req, function(err) {
    if (!!err) {
      return error.send(err, res);
    }

    my.validate(req, function(err, msg) {
      if (!!err) {
        return error.send(err, res);
      }
      if (!!msg) {
        return error.send(msg, res);
      }

      my.preCheckStatus(req, function(err, status) {
        if (!!err) {
          return error.send(err, res);
        }
        if (status === 200) {
          performSave();
        } else {
          res.status(status);
          res.end();
        }
      });
    });
  });


  function assignIdFromRequest() {
    if (req.params && req.params.id) {
      req.body._id = new ObjectId(req.params.id);
    } else {
      req.body_id = undefined;
    }
  }

  function performSave() {
    my.collection.save(req.body, function(err, a) {
      if (!!err) {
        return error.send(err, res);
      }
      if (!req.params || !req.params.id) {
        res.status(201);
      }
      res.send(a);
    });
  }
};

Accounts.prototype.remove = function(req, res) {
  var my = this;

  my.preCheckStatus(req, function(err, status) {
    if (!!err) {
      return error.send(err, res);
    }
    if (status === 200) {
      removeItem();
    } else {
      res.status(status);
      res.end();
    }
  });

  function removeItem() {
    my.preRemoveAction(req, function(err) {
      if (!!err) {
        return error.send(err, res);
      }
      my.collection.remove({_id: new ObjectId(req.params.id)}, function(err) {
        if (!!err) {
          return error.send(err, res);
        }
        res.send();
      });
    });
  }
};

Accounts.prototype.preSaveAction = function(req, done) {
  if (!!req.body.entityRid) {
    req.body.entityRid = new ObjectId(req.body.entityRid);
  }
  done(null);
};

Accounts.prototype.preRemoveAction = function(req, done) {
  db.events.remove({accountRid: new ObjectId(req.params.id)}, done);
};

Accounts.prototype.validate = function(req, done) {
  done(null, null);
};

Accounts.prototype.preCheckStatus = function(req, done) {
  var my = this;

  if (!req.params || !req.params.id) {
    done(null, 200);
  }
  else {
    var criteria = _.extend({}, my.criteria);
    criteria._id = new ObjectId(req.params.id);
    my.collection.findOne(criteria, function(err, a) {
      done(err, !!a ? 200 : 404);
    });
  }
};

Accounts.prototype.postGetAction = function(accts, done) {
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
    done(err, accts);
  });
};

module.exports = new Accounts();