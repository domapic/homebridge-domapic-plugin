'use strict'

const { DOMAPIC } = require('../lib/statics')
const SwitchFactory = require('../lib/plugins/SwitchFactory')

module.exports = function (homebridge) {
  const Switch = new SwitchFactory(homebridge.hap.Service, homebridge.hap.Characteristic)
  homebridge.registerAccessory(DOMAPIC, Switch.name, Switch)

  // TODO, register accesories for all HomeKit accesory types
}
