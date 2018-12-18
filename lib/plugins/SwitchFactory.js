'use strict'

const requestPromise = require('request-promise')

const { DOMAPIC, HOMEBRIDGE_ERROR, ACCESSORY_SWITCH } = require('../statics')

const SwitchFactory = function (Service, Characteristic) {
  return class Switch {
    constructor (log, config) {
      this.config = config
      this.log = log

      this.getServices = this.getServices.bind(this)
      this.getSwitchOnCharacteristic = this.getSwitchOnCharacteristic.bind(this)
      this.setSwitchOnCharacteristic = this.setSwitchOnCharacteristic.bind(this)
      this.getSwitchOnFixtureCharacteristic = this.getSwitchOnFixtureCharacteristic.bind(this)
      this.setSwitchOnFixtureCharacteristic = this.setSwitchOnFixtureCharacteristic.bind(this)

      const onCharacteristicConfig = this.config.characteristics.find(characteristicData => characteristicData.characteristic === 'On')

      this.setOnAbility = onCharacteristicConfig.set && onCharacteristicConfig.set.ability
      this.setOnAbilityDataType = onCharacteristicConfig.set && onCharacteristicConfig.set.dataType
      this.setOnFixture = onCharacteristicConfig.set && onCharacteristicConfig.set.fixture
      this.setOnAbilityUrl = this.setOnAbility ? `${this.config.abilitiesBridgeUrl}${this.setOnAbility}` : null

      this.getOnAbility = onCharacteristicConfig.get && onCharacteristicConfig.get.ability
      this.getOnFixture = onCharacteristicConfig.get && onCharacteristicConfig.get.fixture
      this.getOnAbilityUrl = this.getOnAbility ? `${this.config.abilitiesBridgeUrl}${this.getOnAbility}` : null

      this.requestOptions = {
        json: true,
        headers: {
          'X-Api-Key': this.config.apiKey
        },
        method: 'GET'
      }
    }

    static get name () {
      return ACCESSORY_SWITCH
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
        .setCharacteristic(Characteristic.FirmwareRevision, this.config.serviceVersion)

      const switchService = new Service.Switch(this.config.name)
      switchService.getCharacteristic(Characteristic.On)
        .on('get', this.getOnAbilityUrl ? this.getSwitchOnCharacteristic : this.getSwitchOnFixtureCharacteristic)
        .on('set', this.setOnAbilityUrl ? this.setSwitchOnCharacteristic : this.setSwitchOnFixtureCharacteristic)

      this.informationService = informationService
      this.switchService = switchService
      return [informationService, switchService]
    }

    getSwitchOnFixtureCharacteristic (next) {
      this.log(`Getting fixture button state. Returning fixed value`)
      next(null, this.getOnFixture)
      return Promise.resolve()
    }

    getSwitchOnCharacteristic (next) {
      this.log(`Getting state`)
      return requestPromise({
        ...this.requestOptions,
        uri: this.getOnAbilityUrl
      }).then(body => {
        this.log(`State is "${body.data}"`)
        next(null, body.data)
      }).catch(error => {
        this.logError(error)
        next(error)
      })
    }

    setSwitchOnFixtureCharacteristic (next) {
      this.log(`Setting fixture.`)
      next()
      return Promise.resolve()
    }

    setSwitchOnCharacteristic (on, next) {
      this.log(`Setting to "${on}"`)
      const body = this.setOnAbilityDataType ? { data: on } : undefined
      return requestPromise({
        ...this.requestOptions,
        uri: this.setOnAbilityUrl,
        method: 'POST',
        body
      }).then(() => {
        this.log(`Set to "${on}" success`)
        next()
      }).catch(error => {
        this.logError(error)
        next(error)
      })
    }
  }
}

module.exports = SwitchFactory
