'use strict'

const { DOMAPIC } = require('../lib/statics')
const SwitchFactory = require('../lib/plugins/SwitchFactory')
const ButtonFactory = require('../lib/plugins/ButtonFactory')

module.exports = function (homebridge) {
  const Switch = new SwitchFactory(homebridge.hap.Service, homebridge.hap.Characteristic)
  homebridge.registerAccessory(DOMAPIC, Switch.name, Switch)

  const Button = new ButtonFactory(homebridge.hap.Service, homebridge.hap.Characteristic)
  homebridge.registerAccessory(DOMAPIC, Button.name, Button)

  // TODO, register accesories for all HomeKit accesory types
}
