'use strict'

const { DOMAPIC, HOMEBRIDGE_ERROR } = require('../../statics')

class Plugin {
  constructor (log, config) {
    this.config = config
    this.log = log

    this.getServices = this.getServices.bind(this)

    this.requestOptions = {
      json: true,
      headers: {
        'X-Api-Key': this.config.apiKey
      }
    }
  }

  logError (error) {
    this.log(`${HOMEBRIDGE_ERROR} ${error.message}`)
  }

  getAccesoryInformation () {
    const informationService = new this.Service.AccessoryInformation()
    informationService
      .setCharacteristic(this.Characteristic.Manufacturer, DOMAPIC)
      .setCharacteristic(this.Characteristic.Model, this.config.servicePackageName)
      .setCharacteristic(this.Characteristic.SerialNumber, this.config.serviceProcessId)
      .setCharacteristic(this.Characteristic.FirmwareRevision, this.config.serviceVersion)

    return informationService
  }

  getServices () {
    const informationService = this.getAccesoryInformation()
    const service = this.getService()

    return [informationService, service]
  }
}

module.exports = Plugin
