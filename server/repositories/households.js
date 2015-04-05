'use strict';

var db = require('../config/database');
var error = require('../services/error');
var ObjectId = require('mongojs').ObjectId;
var Q = require('q');

module.exports.get = function(req, res) {
  db.entities.find({
    entityType: 'household'
  }, function(err, h) {
    if (err) {
      return error.send(err, res);
    }
    res.send(h);
  });
};

module.exports.save = function(req, res) {
  assignIdFromRequest();
  setEntityType();
  if (dataIsValid(req, res)) {
    actionIsValid(req).done(yes, no);
  }

  function assignIdFromRequest() {
    if (req.params && req.params.id) {
      req.body._id = new ObjectId(req.params.id);
    }
  }

  function setEntityType() {
    req.body.entityType = 'household';
  }

  function yes() {
    db.entities.save(req.body, function(err, h) {
      if (err) {
        error.send(err, res);
      }
      if (!req.params || !req.params.id) {
        res.status(201);
      }
      res.send(h);
    });
  }

  function no(stat) {
    res.status(stat);
    res.end();
  }
};

function dataIsValid(req, res) {
  var data = req.body;
  if (!data.name) {
    error.send(new Error('Name is required'), res);
    return false;
  }
  if (!data.addressLine1) {
    error.send(new Error('Address line 1 is required'), res);
    return false;
  }
  if (!data.city) {
    error.send(new Error('City is required'), res);
    return false;
  }
  if (!data.state) {
    error.send(new Error('State is required'), res);
    return false;
  }
  if (!data.postal) {
    error.send(new Error('Postal code is required'), res);
    return false;
  }
  return true;
}

function actionIsValid(req) {
  var dfd = Q.defer();
  if (!req.params || !req.params.id) {
    dfd.resolve(true);
  }
  else {
    db.entities.findOne({
      _id: new ObjectId(req.params.id)
    }, function(err, h) {
      if (!h) {
        return dfd.reject(404);
      }
      dfd.resolve(true);
    });
  }
  return dfd.promise;
}