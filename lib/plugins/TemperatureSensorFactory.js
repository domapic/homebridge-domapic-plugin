'use strict'

const AbstractSensorFactory = require('./common/AbstractSensorFactory')

const TemperatureSensorFactory = new AbstractSensorFactory(
  'TemperatureSensor',
  'CurrentTemperature'
)

module.exports = TemperatureSensorFactory
