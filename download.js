#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var os = require('os');
var mkdirp = require('mkdirp');
var nugget = require('nugget');
var extract = require('extract-zip');
var del = require('del');

var filename = ['Mancy-', process.platform, '-', process.arch].join('');
var zipFile = [filename, '.zip'].join('');

var exeName = {
  win32 : 'Mancy.exe',
  linux : 'Mancy',
  darwin : 'Mancy.app/Contents/MacOS/Electron'
};

if (!exeName[process.platform]) { throw new Error('Unsupported platform ' + process.platform); }

var version = require('./package').version.replace(/-.*$/, '');
// Already installed ?
try {
  if (fs.readFileSync(path.join(__dirname, 'dist', 'semver'), 'utf8') === version
    && fs.existsSync(path.join(__dirname, 'dist', filename, exeName[process.platform]))) {
    process.exit(0);
  }
} catch(e) {}

// clean dist directory
del.sync([path.join(__dirname, 'dist', '**/*')]);

// target location
var urlPrefix = 'https://github.com/princejwesley/Mancy/releases/download/v';
var target = urlPrefix + version + '/' + zipFile;

// tmp file
var hrtime = process.hrtime();
var tmp = path.join(os.tmpdir(),
  ['mancy-download-', Date.now(), '-', hrtime[0], '-', hrtime[1]].join(''));
var tmpFile = path.join(tmp, zipFile);

mkdirp(tmp, function(err) {
  if(err) { throw err; }
  download();
});

function download() {
  nugget(target, {
    strictSSL: process.env.npm_config_strict_ssl,
    proxy: process.env.npm_config_https_proxy || process.env.npm_config_proxy,
    resume: true,
    verbose: true,
    target: zipFile,
    dir: tmp
  }, function(err) {
    if(err) { throw err; }
    extract(tmpFile, { dir: path.join(__dirname, 'dist') }, function(err) {
      if (err) { throw err; }
      fs.writeFile(path.join(__dirname, 'dist', 'semver'), version, 'utf8', function(err) {
        if(err) { throw err; }
      });
    });
  });
}
