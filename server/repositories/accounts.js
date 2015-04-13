'use strict';

var _ = require('underscore');
var authentication = require('../services/authentication');
var db = require('../config/database');
var ObjectId = require('mongojs').ObjectId;
var redirect = require('../services/redirect');
var RepositoryBase = require('./RepositoryBase');
var util = require('util');

function Accounts() {
  RepositoryBase.call(this);
  this.collection = db.accounts;
  this.criteria = {};
}

util.inherits(Accounts, RepositoryBase);

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

var accounts = new Accounts();

module.exports.init = function(app) {
  app.get('/api/accounts', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {accounts.get(req, res);});
  app.get('/api/accounts/:id', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {accounts.getOne(req, res);});
  app.post('/api/accounts/:id?', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {accounts.save(req, res);});
  app.delete('/api/accounts/:id', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {accounts.remove(req, res);});
};