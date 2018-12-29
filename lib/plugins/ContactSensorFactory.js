'use strict'

const AbstractSensorFactory = require('./common/AbstractSensorFactory')

const ContactSensorFactory = new AbstractSensorFactory(
  'ContactSensor',
  'ContactSensorState'
)

module.exports = ContactSensorFactory
