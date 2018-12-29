'use strict'

const AbstractSensorFactory = require('./common/AbstractSensorFactory')

const HumiditySensorFactory = new AbstractSensorFactory(
  'HumiditySensor',
  'CurrentRelativeHumidity'
)

module.exports = HumiditySensorFactory
