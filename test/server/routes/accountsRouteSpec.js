'use strict';

var expect = require('chai').expect;
var express = require('express');
var bodyParser = require('body-parser');
var request = require('supertest');
var proxyquire = require('proxyquire');
var db = require('../../../server/config/database');
var ObjectId = require('mongojs').ObjectId;

describe('api/accounts Routes', function() {
  var app;

  var myCar;
  var myHouse;
  var myCarLoan;
  var myFirstMortgage;
  var mySecondMortgage;

  var authStub = {
    requiresApiLogin: function(req, res, next) {
      requiresApiLoginCalled = true;
      next();
    }
  };
  var requiresApiLoginCalled;

  beforeEach(function() {
    app = express();
    app.use(bodyParser());
  });

  beforeEach(function() {
    requiresApiLoginCalled = false;
    proxyquire('../../../server/config/routes', {
      '../services/authentication': authStub
    })(app);
  });

  beforeEach(function(done) {
    loadData(done);
  });

  afterEach(function(done) {
    removeData(done);
  });

  it('runs', function(done) {
    db.accounts.find({}, function(err, a) {
      expect(a.length).to.equal(3);
      done();
    });
  });

  function loadData(done) {
    removeData(function() {
      loadEntities(function() {
        loadAccounts(function() {
          loadEvents(function() {
            done();
          });
        });
      });
    });
  }

  function loadEntities(done) {
    db.entities.insert([{
      name: 'My House',
      entityeType: 'household'
    }, {
      name: 'My Car',
      entityType: 'vehicle'
    }], function() {
      db.entities.findOne({name: 'My House'}, function(err, e) {
        myHouse = e;
        db.entities.findOne({name: 'My Car'}, function(err, e) {
          myCar = e;
          done();
        });
      });
    });
  }

  function loadAccounts(done) {
    db.accounts.save({
      name: 'Mortgage',
      bank: 'Eastern World Bank',
      accountNumber: '1399405-2093',
      accountType: 'loan',
      balanceType: 'liability',
      amount: '176940.43',
      entityRid: myHouse._id
    }, function(err, a) {
      myFirstMortgage = a;
      db.accounts.save({
        name: 'Second Mortgage',
        bank: 'Western State Bank',
        accountNumber: '38984905-39',
        accountType: 'loan',
        balanceType: 'liability',
        amount: '30495.78',
        entityRid: myHouse._id
      }, function(err, a) {
        mySecondMortgage = a;
        db.accounts.save({
          name: 'Car Loan',
          bank: 'Northern City Bank',
          accountNumber: '899348509a-83c',
          accountType: 'loan',
          balanceType: 'liability',
          amount: '13953.00',
          entityRid: myCar._id
        }, function(err, a) {
          myCarLoan = a;
          done();
        });
      });
    });
  }

  function loadEvents(done) {
    db.events.insert([{
      name: '1st Mortgage, Trans #1',
      principalAmount: -943.93,
      interestAmount: -394.82,
      eventType: 'transaction'
    }, {
      name: '1st Mortgage, Trans #2',
      principalAmount: -944.90,
      interestAmount: -393.95,
      eventType: 'transaction'
    }, {
      name: '1st Mortgage, Trans #3',
      principalAmount: -945.62,
      interestAmount: -393.13,
      eventType: 'transaction'
    }, {
      name: '2st Mortgage, Trans #1',
      principalAmount: -199.25,
      interestAmount: -101.25,
      eventType: 'transaction'
    }, {
      name: '2st Mortgage, Trans #2',
      principalAmount: -198.65,
      interestAmount: -101.85,
      eventType: 'transaction'
    }], function() {
      done();
    });
  }

  function removeData(done) {
    db.accounts.remove(function() {
      db.events.remove(function() {
        db.entities.remove(function() {
          done();
        });
      });
    });
  }
});
