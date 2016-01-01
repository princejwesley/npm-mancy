#!/usr/bin/env node
require('child_process')
  .spawn(require('./'), process.argv.slice(2), { stdio: 'inherit' })
  .on('close', process.exit.bind(process));
