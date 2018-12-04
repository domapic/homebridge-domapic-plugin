'use strict'

const path = require('path')

const domapic = require('domapic-service')

const Homebridge = require('./lib/Homebridge')

domapic.createPlugin({
  packagePath: path.resolve(__dirname)
}).then(dmpcPlugin => {
  const homebridge = new Homebridge(dmpcPlugin)
  homebridge.start()
  return dmpcPlugin.start()
})
