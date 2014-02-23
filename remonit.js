// node.js client for Remonit
//
// exports 4 functions
// connect(callback(err)): connect to Remonit server
// close(): close connection, this terminates events loop
// get(collection, callback(err, result)): query for docs in collection
// put(collection, doc, callback(err))

'use strict'

module.exports = {
  connect: connect,
  close: close,
  get: get,
  put: put
}

var DDP = require('ddp')
var config = require('./config.js')

var connected = false

var ddp = new DDP({
  host: 'remonit.zef.io',
  port: 80,
  auto_reconnect: true,
  auto_reconnect_timer: 500,
  use_ejson: true,
  use_ssl: false
})

function connect(callback) {
  if (!config.email || ! config.password) {
    callback('No valid ~/.remonit.json or ./remonit.json found.\n' +
      'Please create one (see https://github.com/zefei/remonit-cli for more info).')
    return
  }

  ddp.connect(function(err) {
    if (err) {
      callback('Failed to connect.')
      return
    }

    login(callback)
  })
}

function login(callback) {
  ddp.loginWithEmail(config.email, config.password, function(err) {
    if (err) {
      ddp.close()
      callback('Failed to login.')
    } else {
      connected = true
      callback()
    }
  })
}

function close() {
  if (connected) ddp.close()
}

function get(collection, callback) {
  if (!connected) {
    callback('Not connected.')
  } else {
    ddp.call(collection, [], callback)
  }
}

function put(collection, doc, callback) {
  if (!connected) {
    callback('Not connected.')
  } else {
    ddp.call(collection + 'Save', [doc], callback)
  }
}
