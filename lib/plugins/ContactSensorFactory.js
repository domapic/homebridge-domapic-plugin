'use strict'

const { ACCESSORY_CONTACT_SENSOR } = require('../statics')
const Plugin = require('./common/Plugin')
const CharacteristicMethods = require('./common/CharacteristicMethods')

const ContactSensorFactory = function (Service, Characteristic) {
  return class ContactSensor extends Plugin {
    constructor (log, config) {
      super(log, config)
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
      const contactSensor = new CharacteristicMethods(this.contactSensorConfig, this.config.abilitiesBridgeUrl)
      service.getCharacteristic(Characteristic.ContactSensorState)
        .on('get', contactSensor.get.bind(this))

      return service
    }
  }
}

module.exports = ContactSensorFactory
