#!/usr/bin/env node

// remonit-pull: cli command to retrieve Remonit stats object
// Usage: remonit-pull
// Noitce: login info should be stored in either ./remonit.json or 
// ~/.remonit.json

'use strict'

var remonit = require('./remonit.js')

remonit.connect(function(err) {
  if (err) {
    console.log(err + '\n')
    return
  }

  remonit.get('stats', function(err, result) {
    if (err) {
      console.log(err + '\n')
      remonit.close()
      return
    }

    // pretty print stats object
    console.log(JSON.stringify(result, null, 2))
    remonit.close()
  })
})
