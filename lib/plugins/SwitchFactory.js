'use strict'

const { ACCESSORY_SWITCH } = require('../statics')

const Plugin = require('./common/Plugin')
const CharacteristicMethods = require('./common/CharacteristicMethods')

const SwitchFactory = function (Service, Characteristic) {
  return class Switch extends Plugin {
    constructor (log, config) {
      super(log, config)
      this.Service = Service
      this.Characteristic = Characteristic
      this.onConfig = this.config.characteristics.find(characteristicData =>
        characteristicData.characteristic === 'On'
      )
    }

    static get name () {
      return ACCESSORY_SWITCH
    }

    getService () {
      const service = new this.Service.Switch(this.config.name)
      const on = new CharacteristicMethods(this.onConfig, this.config.abilitiesBridgeUrl)
      service.getCharacteristic(Characteristic.On)
        .on('get', on.get.bind(this))
        .on('set', on.set.bind(this))

      return service
    }
  }
}

module.exports = SwitchFactory
