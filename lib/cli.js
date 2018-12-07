'use strict'

const path = require('path')
const domapic = require('domapic-service')

const options = require('./options')

domapic.cli({
  packagePath: path.resolve(__dirname, '..'),
  script: path.resolve(__dirname, '..', 'server.js'),
  customConfig: options
})
