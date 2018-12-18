'use strict'

const { flatten, compact } = require('lodash')

const {
  LOADING_ACCESORIES,
  ERROR_SERVICE_ACCESORY_CONFIG
} = require('./statics')

class Accessories {
  constructor (dpmcPlugin) {
    this.plugin = dpmcPlugin
  }

  async createDefaultConfig (service, serviceAbilities) {
    // TODO, create default config for switchs, and switchs without state
    return null
  }

  async getServiceConfig (service) {
    await this.plugin.controller.servicePluginConfigs.get({
      'plugin-package-name': 'homebridge-domapic-plugin',
      service
    })
  }

  getCharacteristicConfigData (characteristicMethodConfig, serviceAbilities) {
    if (!characteristicMethodConfig) {
      return null
    }
    if (characteristicMethodConfig.ability) {
      return {
        ability: serviceAbilities.find(ability => ability.name === characteristicMethodConfig.ability)
      }
    }
    return {
      fixture: characteristicMethodConfig.fixture
    }
  }

  getServiceAccesoryConfig (service, serviceAbilities, serviceConfig) {
    return serviceConfig.accessories.map(accessoryConfig => ({
      service,
      accesory: accessoryConfig.accessory,
      name: accessoryConfig.name || `${service.name} ${accessoryConfig.accesory}`,
      characteristics: accessoryConfig.characteristics.map(characteristicConfig => ({
        characteristic: characteristicConfig.characteristic,
        get: this.getCharacteristicConfigData(characteristicConfig.get, serviceAbilities),
        set: this.getCharacteristicConfigData(characteristicConfig.set, serviceAbilities),
        identify: this.getCharacteristicConfigData(characteristicConfig.identify, serviceAbilities)
      }))
    }))
  }

  async get () {
    await this.plugin.tracer.info(LOADING_ACCESORIES)
    const abilities = await this.plugin.controller.abilities.get()
    const services = await this.plugin.controller.services.get()

    return flatten(compact(services.map(async service => {
      let serviceAccesoryConfig
      const serviceConfig = await this.getServiceConfig(service._id)
      const serviceAbilities = abilities.filter(ability => ability._service === service._id)
      if (!serviceConfig.length) {
        return this.createDefaultConfig(service, serviceAbilities)
      }
      try {
        serviceAccesoryConfig = this.getServiceAccesoryConfig(service, serviceAbilities, serviceConfig)
      } catch (err) {
        await this.plugin.tracer.error(ERROR_SERVICE_ACCESORY_CONFIG, err)
        serviceAccesoryConfig = null
      }
      return serviceAccesoryConfig
    })))
  }
}

module.exports = Accessories
