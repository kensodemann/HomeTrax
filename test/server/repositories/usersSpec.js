'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var db = require('../../../server/config/database');
var proxyquire = require('proxyquire');
var ObjectId = require('mongojs').ObjectId;

describe('Users Repository', function(){
  var usersRepository;
  var mockEncryption;
  beforeEach(function(){
    mockEncryption = sinon.stub({
      createSalt:function(){},
      hash:function(){}
    });
  });

  beforeEach(function(){
    usersRepository = proxyquire('../../../server/repositories/users', {
      '../services/encryption': mockEncryption
    });
  });
});