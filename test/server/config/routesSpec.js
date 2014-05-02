var expect = require('chai').expect;
var express = require('express');
var path = require('path');
var request = require('supertest');

describe('routes', function() {
  var app;

  beforeEach(function() {
    app = express();
    var fakeViewPath = path.normalize(__dirname + '/../mockViews');
    app.set('view engine', 'jade');
    app.set('views', fakeViewPath);
    require('../../../server/config/routes')(app);
  });

  it('Goes to the inedex view for the root route', function(done) {
    request(app)
      .get('/')
      .expect('<index></index>')
      .expect(200, done);
  });

  it('Goes to the inedex view for unkown routes', function(done) {
    request(app)
      .get('/i_dont_exist')
      .expect('<index></index>')
      .expect(200, done);
  });

  // it('Loads valid partials', function(done) {
  //   request(app)
  //     .get('/partials/calendar/main')
  //     .expect('<index></index>')
  //     .expect(200, done);
  // });

});