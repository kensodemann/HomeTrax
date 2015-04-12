'use strict';

var db = require('../config/database');
var RepositoryBase = require("./RepositoryBase");
var util = require("util");

function EventCategories(){
  RepositoryBase.call(this);
  this.collection = db.eventCategories;
}

util.inherits(EventCategories, RepositoryBase);

module.exports = new EventCategories();