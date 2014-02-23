#!/usr/bin/env node

// remonit-push: cli command to push data from stdin to Remonit stats object
// Usage: remonit-push <stats_name>
// Example: ls | remonit-push 'my ls output'
// Noitce: login info should be stored in either ./remonit.json or 
// ~/.remonit.json

'use strict'

var stats = {}
var name = process.argv[2]
var lines = []
var LINES_MAX = 100

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
    var value = stats[name] = (s[name] || '') // current stats value

    // separate stats by '\n', so that we can easily tail data
    lines = value.split('\n')

    // if stats ends with '\n', we will have one trailing empty element
    if (value[value.length - 1] === '\n') lines.pop()

    run()
  })
}

var ended = false

function run() {
  var Lazy = require('lazy')
  var stdin = process.stdin

  new Lazy(stdin)
  .on('end', function() {
    finalize()
  })
  .lines
  .forEach(function(line) {
    write(line.toString())
  })

  console.log('Piping to Remonit...\n')
  stdin.resume()
}

// throttled update
var updateStats = _.throttle(function() {
  if (!ended) remonit.put('stats', stats)
}, 1000)

function write(line) {
  // echo this line
  console.log(line)

  // add line to lines
  lines.push(line)
  lines = lines.slice(-LINES_MAX) // keep last LINES_MAX lines

  // update stats
  stats[name] = lines.join('\n')
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
