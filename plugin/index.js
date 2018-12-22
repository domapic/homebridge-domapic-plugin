'use strict'

const { DOMAPIC } = require('../lib/statics')
const SwitchFactory = require('../lib/plugins/SwitchFactory')
const ContactSensorFactory = require('../lib/plugins/ContactSensorFactory')

const NotificationsBridge = require('./NotificationsBridge')

module.exports = function (homebridge) {
  const notificationsBridge = new NotificationsBridge()

  const Switch = new SwitchFactory(homebridge.hap.Service, homebridge.hap.Characteristic, notificationsBridge)
  homebridge.registerAccessory(DOMAPIC, Switch.name, Switch)

  const ContactSensor = new ContactSensorFactory(homebridge.hap.Service, homebridge.hap.Characteristic, notificationsBridge)
  homebridge.registerAccessory(DOMAPIC, ContactSensor.name, ContactSensor)

  // TODO, register accesories for all HomeKit accesory types
}
