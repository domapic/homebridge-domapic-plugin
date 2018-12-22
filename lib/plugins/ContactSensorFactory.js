'use strict'

const { ACCESSORY_CONTACT_SENSOR, NOTIFY_EVENT } = require('../statics')
const Plugin = require('./common/Plugin')
const CharacteristicMethods = require('./common/CharacteristicMethods')

const ContactSensorFactory = function (Service, Characteristic, notificationsBridge) {
  return class ContactSensor extends Plugin {
    constructor (log, config) {
      super(log, config, notificationsBridge)
      this.Service = Service
      this.Characteristic = Characteristic
      this.contactSensorConfig = this.config.characteristics.find(characteristicData =>
        characteristicData.characteristic === 'ContactSensorState'
      )
    }

    static get name () {
      return ACCESSORY_CONTACT_SENSOR
    }

    getService () {
      const service = new this.Service.ContactSensor(this.config.name)
      const contactSensor = new CharacteristicMethods(
        this.contactSensorConfig,
        this.config.abilitiesBridgeUrl,
        this.notifications
      )
      service.getCharacteristic(Characteristic.ContactSensorState)
        .on('get', contactSensor.get.bind(this))

      contactSensor.emitter.on(NOTIFY_EVENT, value => {
        this.log(`Updating value to ${value}`)
        service.getCharacteristic(Characteristic.ContactSensorState).updateValue(value)
      })

      return service
    }
  }
}

module.exports = ContactSensorFactory
