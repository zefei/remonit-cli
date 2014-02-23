#!/usr/bin/env node

// once installed, inform user about remonit.json

'use strict'

var fs = require('fs')
var path = require('path')

var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
var file = path.join(home, '.remonit.json')

if (!fs.existsSync(file)) {
  var config = {email: '', password: ''}
  fs.writeFileSync(file, JSON.stringify(config, null, 2))

  console.log('\nNotice: please edit ~/.remonit.json with proper configuration.')
  console.log('See https://github.com/zefei/remonit-cli for more info.\n')
}
