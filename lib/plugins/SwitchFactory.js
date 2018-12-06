'use strict'

const url = require('url')

const requestPromise = require('request-promise')

const { DOMAPIC, HOMEBRIDGE_ERROR } = require('../statics')

const NAME = 'Switch'

const SwitchFactory = function (Service, Characteristic) {
  return class Switch {
    constructor (log, config) {
      this.config = config
      this.log = log
      this.getUrl = url.parse(this.config.getUrl)
      this.postUrl = url.parse(this.config.postUrl)
      this.getServices = this.getServices.bind(this)
      this.getSwitchOnCharacteristic = this.getSwitchOnCharacteristic.bind(this)
      this.setSwitchOnCharacteristic = this.setSwitchOnCharacteristic.bind(this)
    }

    static get name () {
      return NAME
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
      requestPromise({
        uri: this.getUrl,
        method: 'GET',
        json: true
      }).then(body => {
        next(null, body.data)
      }).catch(error => {
        this.log(`${HOMEBRIDGE_ERROR} ${error.message}`)
        next(error)
      })
    }

    setSwitchOnCharacteristic (on, next) {
      console.log(on)
      requestPromise({
        uri: this.postUrl,
        method: 'POST',
        body: {
          data: on
        },
        json: true
      }).then(() => {
        next()
      }).catch(error => {
        this.log(`${HOMEBRIDGE_ERROR} ${error.message}`)
        next(error)
      })
    }
  }
}

module.exports = SwitchFactory
