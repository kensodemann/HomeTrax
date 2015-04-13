'use strict';

var authentication = require('../services/authentication');
var db = require('../config/database');
var redirect = require('../services/redirect');
var RepositoryBase = require('./RepositoryBase');
var util = require('util');

function Households() {
  RepositoryBase.call(this);
  this.collection = db.entities;
  this.criteria = {entityType: 'household'};
}

util.inherits(Households, RepositoryBase);

Households.prototype.preSaveAction = function(req, done) {
  req.body.entityType = 'household';
  done(null);
};

Households.prototype.validate = function(req, done) {
  if (!req.body) {
    return done(null, new Error('Request is empty.'));
  }
  if (!req.body.name) {
    return done(null, new Error('Name is required'));
  }
  if (!req.body.addressLine1) {
    return done(null, new Error('Address line 1 is required'));
  }
  if (!req.body.city) {
    return done(null, new Error('City is required'));
  }
  if (!req.body.state) {
    return done(null, new Error('State is required'));
  }
  if (!req.body.postal) {
    return done(null, new Error('Postal code is required'));
  }
  done(null, null);
};

var repository = new Households();

module.exports = function(app){
  app.get('/api/households', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {repository.get(req, res);});
  app.post('/api/households/:id?', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {repository.save(req, res);});
};