#!/usr/bin/env node

// remonit-push: cli command to push data from stdin to Remonit stats object
// Usage: remonit-push <stats_name>
// Example: ls | remonit-push 'my ls output'
// Noitce: login info should be stored in either ./remonit.json or 
// ~/.remonit.json

'use strict'

var stats = {}
var name = process.argv[2]
var CHARS_MAX = 5000

if (!name) {
  console.log('Usage: remonit-push <stats_name>\n')
  return
}

var _ = require('lodash')
var remonit = require('./remonit.js')

console.log('Login to Remonit server...')

remonit.connect(function(err) {
  if (err) {
    console.log(err + '\n')
    return
  }

  console.log('Logged in.')
  init()
})

function init() {
  remonit.get('stats', function(err, result) {
    if (err) {
      console.log(err + '\n')
      remonit.close()
      return
    }

    var s = result[0]
    stats = {_id: s._id, userId: s.userId} // we only need these to update stats
    stats[name] = s[name] || '' // current stats value

    run()
  })
}

var ended = false

function run() {
  var stdin = process.stdin

  stdin.on('data', function(chunk) {
    write(chunk.toString())
  })

  stdin.on('end', function() {
    finalize()
  })

  console.log('Piping to Remonit...\n')
  stdin.resume()
}

// throttled update
var updateStats = _.throttle(function() {
  if (!ended) remonit.put('stats', stats)
}, 1000)

function write(data) {
  // echo
  process.stdout.write(data)

  // update stats
  stats[name] += data
  stats[name] = stats[name].substr(-CHARS_MAX)
  updateStats()
}

function finalize() {
  // prevent other updates
  ended = true

  // update one last time
  remonit.put('stats', stats, function() {
    remonit.close()
  })
}
