#!/bin/env node
var ServerApp = require('./server/app');

var zapp = new ServerApp();
zapp.initialize();
zapp.start();