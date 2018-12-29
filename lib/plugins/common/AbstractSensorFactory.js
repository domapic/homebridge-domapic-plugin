'use strict'

const { NOTIFY_EVENT } = require('../../statics')
const Plugin = require('./Plugin')
const CharacteristicMethods = require('./CharacteristicMethods')

const AbstractSensorFactory = function (serviceName, characteristicName) {
  const SensorFactory = function (Service, Characteristic, notificationsBridge) {
    return class Sensor extends Plugin {
      constructor (log, config) {
        super(log, config, notificationsBridge)
        this.Service = Service
        this.Characteristic = Characteristic
        this.sensorConfig = this.config.characteristics.find(characteristicData =>
          characteristicData.characteristic === characteristicName
        )
      }

      static get name () {
        return serviceName
      }

      getService () {
        const service = new this.Service[serviceName](this.config.name)
        const sensor = new CharacteristicMethods(
          this.sensorConfig,
          this.config.abilitiesBridgeUrl,
          this.notifications
        )
        service.getCharacteristic(Characteristic[characteristicName])
          .on('get', sensor.get.bind(this))

        if (sensor.emitter) {
          sensor.emitter.on(NOTIFY_EVENT, value => {
            this.log(`Updating value to ${value}`)
            service.getCharacteristic(Characteristic[characteristicName]).updateValue(value)
          })
        }

        return service
      }
    }
  }

  return SensorFactory
}

module.exports = AbstractSensorFactory
