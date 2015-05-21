'use strict';

var authentication = require('../services/authentication');
var db = require('../config/database');
var redirect = require('../services/redirect');
var RepositoryBase = require('./RepositoryBase');
var util = require('util');

function Entities() {
  RepositoryBase.call(this);
  this.collection = db.entities;
}

util.inherits(Entities, RepositoryBase);

var repository = new Entities();

module.exports = function(app){
  app.get('/api/entities', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {repository.get(req, res);});
  app.post('/api/entities/:id?', redirect.toHttps, authentication.requiresApiLogin,
    function(req, res) {repository.save(req, res);});
};