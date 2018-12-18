'use strict'

const { DOMAPIC } = require('../lib/statics')
const SwitchFactory = require('../lib/plugins/SwitchFactory')
const ContactSensorFactory = require('../lib/plugins/ContactSensorFactory')

module.exports = function (homebridge) {
  const Switch = new SwitchFactory(homebridge.hap.Service, homebridge.hap.Characteristic)
  homebridge.registerAccessory(DOMAPIC, Switch.name, Switch)

  const ContactSensor = new ContactSensorFactory(homebridge.hap.Service, homebridge.hap.Characteristic)
  homebridge.registerAccessory(DOMAPIC, ContactSensor.name, ContactSensor)

  // TODO, register accesories for all HomeKit accesory types
}
