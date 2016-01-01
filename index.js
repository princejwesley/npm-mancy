#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var zipDir = ['Mancy-', process.platform, '-', process.arch].join('');
var exeName = {
  win32 : 'Mancy.exe',
  linux : 'Mancy',
  darwin : 'Mancy.app/Contents/MacOS/Electron'
};

module.exports = path.join(__dirname, 'dist', zipDir, exeName[process.platform]);
