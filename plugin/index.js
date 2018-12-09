'use strict'

const { DOMAPIC } = require('../lib/statics')
const SwitchFactory = require('../lib/plugins/SwitchFactory')
const StatelessSwitchFactory = require('../lib/plugins/StatelessSwitchFactory')

module.exports = function (homebridge) {
  const Switch = new SwitchFactory(homebridge.hap.Service, homebridge.hap.Characteristic)
  homebridge.registerAccessory(DOMAPIC, Switch.name, Switch)

  const StatelessSwitch = new StatelessSwitchFactory(homebridge.hap.Service, homebridge.hap.Characteristic)
  homebridge.registerAccessory(DOMAPIC, StatelessSwitch.name, StatelessSwitch)

  // TODO, register accesories for all HomeKit accesory types
}
