'use strict';

var _ = require('underscore');
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
    var repo = proxyquire('../../../server/repositories/accounts', {
      '../services/authentication': authStub
    });
    repo.init(app);
  });

  beforeEach(function(done) {
    loadData(done);
  });

  afterEach(function(done) {
    removeData(done);
  });

  describe('GET Collection', function() {
    it('requires an API login', function(done) {
      request(app)
        .get('/api/accounts')
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('returns all of the accounts', function(done) {
      request(app)
        .get('/api/accounts')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
          done();
        });
    });

    it('includes sums and counts', function(done) {
      request(app)
        .get('/api/accounts')
        .end(function(err, res) {
          var accounts = res.body;
          var acct = findAccount(accounts, mySecondMortgage);
          expect(acct.principalPaid).to.equal(397.9);
          expect(acct.interestPaid).to.equal(203.1);
          expect(acct.numberOfTransactions).to.equal(2);
          done();
        });
    });

    function findAccount(accounts, acct) {
      return _.find(accounts, function(a) {
        return a._id === acct._id.toString();
      });
    }
  });

  describe('GET Single', function() {
    it('requires an API login', function(done) {
      request(app)
        .get('/api/accounts/' + myCarLoan._id.toString())
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('returns the specified account', function(done) {
      request(app)
        .get('/api/accounts/' + myCarLoan._id.toString())
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          myCarLoan._id = myCarLoan._id.toString();
          myCarLoan.entityRid = myCarLoan.entityRid.toString();
          expect(res.body).to.deep.equal(myCarLoan);
          done();
        });
    });

    it('returns a 404 status if the account does not exist', function(done) {
      request(app)
        .get('/api/accounts/' + myCar._id.toString())
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe('POST', function() {
    it('requires an API login', function(done) {
      request(app)
        .post('/api/accounts')
        .send({
          name: 'Another Car Loan',
          bank: 'Car Chase Bank',
          accountNumber: '132499503-43',
          accountType: 'loan',
          balanceType: 'liability',
          amount: 5049.83,
          entityRid: myCar._id
        })
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('saves new accounts', function(done) {
      request(app)
        .post('/api/accounts')
        .send({
          name: 'Another Car Loan',
          bank: 'Car Chase Bank',
          accountNumber: '132499503-43',
          accountType: 'loan',
          balanceType: 'liability',
          amount: 5049.83,
          entityRid: myCar._id
        })
        .end(function(err, res) {
          expect(!!err).to.be.false;
          expect(res.status).to.be.equal(201);
          db.accounts.find(function(err, h) {
            expect(h.length).to.equal(4);
            done();
          });
        });
    });

    it('does not add new accounts when updating existing accounts', function(done) {
      request(app)
        .post('/api/accounts/' + myCarLoan._id)
        .send({
          name: 'Another Car Loan',
          bank: 'Car Chase Bank',
          accountNumber: '132499503-43',
          accountType: 'loan',
          balanceType: 'liability',
          amount: 5049.83,
          entityRid: myCar._id
        })
        .end(function(err, res) {
          expect(!!err).to.be.false;
          expect(res.status).to.be.equal(200);
          db.accounts.find(function(err, h) {
            expect(h.length).to.equal(3);
            done();
          });
        });
    });

    it('updates the specified household', function(done) {
      request(app)
        .post('/api/accounts/' + myCarLoan._id)
        .send({
          name: 'Another Car Loan',
          bank: 'Car Chase Bank',
          accountNumber: '132499503-43',
          accountType: 'loan',
          balanceType: 'liability',
          amount: 5049.83,
          entityRid: myCar._id
        })
        .end(function() {
          db.accounts.findOne({
            _id: new ObjectId(myCarLoan._id)
          }, function(err, a) {
            expect(a.name).to.equal('Another Car Loan');
            expect(a.bank).to.equal('Car Chase Bank');
            expect(a.accountNumber).to.equal('132499503-43');
            expect(a.entityRid).to.deep.equal(myCar._id);
            expect(a.amount).to.equal(5049.83);
            done();
          });
        });
    });

    it('returns 404 if the account does not exist', function(done) {
      request(app)
        .post('/api/accounts/54133902bc88a8241ac17f9d')
        .send({
          name: 'Another Car Loan',
          bank: 'Car Chase Bank',
          accountNumber: '132499503-43',
          accountType: 'loan',
          balanceType: 'liability',
          amount: 5049.83,
          entityRid: myCar._id
        })
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe('DELETE', function() {
    it('requires an API login', function(done) {
      request(app)
        .delete('/api/accounts/' + mySecondMortgage._id.toString())
        .send()
        .end(function() {
          expect(requiresApiLoginCalled).to.be.true;
          done();
        });
    });

    it('removes the specified account', function(done) {
      request(app)
        .delete('/api/accounts/' + mySecondMortgage._id.toString())
        .send()
        .end(function() {
          db.accounts.find(function(err, a) {
            expect(a.length).to.equal(2);
            a.forEach(function(item) {
              expect(item._id).to.not.deep.equal(mySecondMortgage._id);
            });
            done();
          });
        });
    });

    it('removes events associated with specified account', function(done) {
      request(app)
        .delete('/api/accounts/' + mySecondMortgage._id.toString())
        .send()
        .end(function() {
          db.events.find(function(err, a) {
            expect(a.length).to.equal(3);
            a.forEach(function(item) {
              expect(item.accountRid).to.not.deep.equal(mySecondMortgage._id);
            });
            done();
          });
        });

    });

    it('returns a status of 404 if the specified account does not exist', function(done) {
      request(app)
        .delete('/api/accounts/55293bd4b4b789415aa33dcf')
        .send()
        .end(function(err, res) {
          expect(res.status).to.equal(404);
          db.accounts.find(function(err, a) {
            expect(a.length).to.equal(3);
            done();
          });
        });
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
      amount: 176940.43,
      entityRid: myHouse._id
    }, function(err, a) {
      myFirstMortgage = a;
      db.accounts.save({
        name: 'Second Mortgage',
        bank: 'Western State Bank',
        accountNumber: '38984905-39',
        accountType: 'loan',
        balanceType: 'liability',
        amount: 30495.78,
        entityRid: myHouse._id
      }, function(err, a) {
        mySecondMortgage = a;
        db.accounts.save({
          name: 'Car Loan',
          bank: 'Northern City Bank',
          accountNumber: '899348509a-83c',
          accountType: 'loan',
          balanceType: 'liability',
          amount: 13953.00,
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
      eventType: 'transaction',
      accountRid: myFirstMortgage._id
    }, {
      name: '1st Mortgage, Trans #2',
      principalAmount: -944.90,
      interestAmount: -393.95,
      eventType: 'transaction',
      accountRid: myFirstMortgage._id
    }, {
      name: '1st Mortgage, Trans #3',
      principalAmount: -945.62,
      interestAmount: -393.13,
      eventType: 'transaction',
      accountRid: myFirstMortgage._id
    }, {
      name: '2nd Mortgage, Trans #1',
      principalAmount: -199.25,
      interestAmount: -101.25,
      eventType: 'transaction',
      accountRid: mySecondMortgage._id
    }, {
      name: '2nd Mortgage, Trans #2',
      principalAmount: -198.65,
      interestAmount: -101.85,
      eventType: 'transaction',
      accountRid: mySecondMortgage._id
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
