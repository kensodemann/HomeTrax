var expect = require('chai').expect;
var express = require('express');
var request = require('supertest');
var config = require('../../../server/config/config');

describe('routes', function() {
  var app;

  beforeEach(function() {
    app = express();
    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');
    require('../../../server/config/routes')(app);
  });

  it('at least works', function(done) {
    // TODO: This is the basic idea, but let's get rid of the use of jade
    //       and let's create our own test views that just have the name
    //       of the view in them.
    request(app)
      .get('/')
      .expect(200, done);
  });

});