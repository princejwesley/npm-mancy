#!/usr/bin/env node
require('child_process')
  .spawn(require('./'), process.argv.slice(2), { stdio: 'inherit', detached: true })
  .on('close', process.exit.bind(process)).unref();
