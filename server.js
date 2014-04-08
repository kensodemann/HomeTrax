#!/bin/env node
var ServerApp = require('./server/ServerApp');

var zapp = new ServerApp();
zapp.initialize();
zapp.start();