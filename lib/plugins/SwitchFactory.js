'use strict'

const url = require('url')

const requestPromise = require('request-promise')

const { DOMAPIC, HOMEBRIDGE_ERROR, ACCESORY_SWITCH_NAME } = require('../statics')

const SwitchFactory = function (Service, Characteristic) {
  return class Switch {
    constructor (log, config) {
      this.config = config
      this.log = log
      this.bridgeUrl = url.parse(this.config.bridgeUrl)
      this.getServices = this.getServices.bind(this)
      this.getSwitchOnCharacteristic = this.getSwitchOnCharacteristic.bind(this)
      this.setSwitchOnCharacteristic = this.setSwitchOnCharacteristic.bind(this)
    }

    static get name () {
      return ACCESORY_SWITCH_NAME
    }

    getServices () {
      const informationService = new Service.AccessoryInformation()
      informationService
        .setCharacteristic(Characteristic.Manufacturer, DOMAPIC)
        .setCharacteristic(Characteristic.Model, this.config.servicePackageName)
        .setCharacteristic(Characteristic.SerialNumber, this.config.serviceProcessId)

      const switchService = new Service.Switch(`${this.config.name}`)
      switchService.getCharacteristic(Characteristic.On)
        .on('get', this.getSwitchOnCharacteristic)
        .on('set', this.setSwitchOnCharacteristic)

      this.informationService = informationService
      this.switchService = switchService
      return [informationService, switchService]
    }

    getSwitchOnCharacteristic (next) {
      this.log(`Getting state`)
      requestPromise({
        uri: this.bridgeUrl,
        method: 'GET',
        json: true,
        headers: {
          'X-Api-Key': this.config.apiKey
        }
      }).then(body => {
        this.log(`State is "${body.data}"`)
        next(null, body.data)
      }).catch(error => {
        this.log(`${HOMEBRIDGE_ERROR} ${error.message}`)
        next(error)
      })
    }

    setSwitchOnCharacteristic (on, next) {
      this.log(`Setting to "${on}"`)
      requestPromise({
        uri: this.bridgeUrl,
        method: 'POST',
        body: {
          data: on
        },
        json: true,
        headers: {
          'X-Api-Key': this.config.apiKey
        }
      }).then(() => {
        this.log(`Set to "${on}" success`)
        next()
      }).catch(error => {
        this.log(`${HOMEBRIDGE_ERROR} ${error.message}`)
        next(error)
      })
    }
  }
}

module.exports = SwitchFactory
