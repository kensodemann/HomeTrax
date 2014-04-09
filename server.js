#!/bin/env node
var ServerApp = require('./server/serverApp');

var zapp = new ServerApp();
zapp.initialize();
zapp.start();