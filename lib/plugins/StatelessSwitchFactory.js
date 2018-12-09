'use strict'

const url = require('url')

const requestPromise = require('request-promise')

const { DOMAPIC, HOMEBRIDGE_ERROR, ACCESORY_STATELESS_SWITCH_NAME } = require('../statics')

const StatelessSwitchFactory = function (Service, Characteristic) {
  return class Switch {
    constructor (log, config) {
      this.config = config
      this.log = log
      this.bridgeUrl = url.parse(this.config.bridgeUrl)
      this.getServices = this.getServices.bind(this)
      this.getSwitchOnCharacteristic = this.getSwitchOnCharacteristic.bind(this)
      this.setSwitchOnCharacteristic = this.setSwitchOnCharacteristic.bind(this)

      this.requestOptions = {
        uri: this.bridgeUrl,
        json: true,
        headers: {
          'X-Api-Key': this.config.apiKey
        },
        method: 'GET'
      }
    }

    static get name () {
      return ACCESORY_STATELESS_SWITCH_NAME
    }

    logError (error) {
      this.log(`${HOMEBRIDGE_ERROR} ${error.message}`)
    }

    getServices () {
      const informationService = new Service.AccessoryInformation()
      informationService
        .setCharacteristic(Characteristic.Manufacturer, DOMAPIC)
        .setCharacteristic(Characteristic.Model, this.config.servicePackageName)
        .setCharacteristic(Characteristic.SerialNumber, this.config.serviceProcessId)

      const switchService = new Service.Switch(this.config.name)
      switchService.getCharacteristic(Characteristic.On)
        .on('get', this.getSwitchOnCharacteristic)
        .on('set', this.setSwitchOnCharacteristic)

      this.informationService = informationService
      this.switchService = switchService
      return [informationService, switchService]
    }

    getSwitchOnCharacteristic (next) {
      this.log(`Getting state. Returning false`)
      next(false)
    }

    setSwitchOnCharacteristic (on, next) {
      this.log(`Triggering`)
      return requestPromise({
        ...this.requestOptions,
        method: 'POST'
      }).then(() => {
        this.log(`Trigger success`)
        next()
      }).catch(error => {
        this.logError(error)
        next(error)
      })
    }
  }
}

module.exports = StatelessSwitchFactory
