// load config object either from ./remonit.json or ~/.remonit.json
//
// export config object

'use strict'

var fs = require('fs')
var path = require('path')

var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
var local = path.join('.', 'remonit.json')
var global = path.join(home, '.remonit.json')
var config = {}

if (fs.existsSync(local)) {
  // read from local file first
  config = JSON.parse(fs.readFileSync(local))

} else if (fs.existsSync(global)) {
  // if local file doesn't exist, read from global file
  config = JSON.parse(fs.readFileSync(global))
}

module.exports = config
