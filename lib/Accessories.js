'use strict'

const { flatten, compact } = require('lodash')

const {
  LOADING_ACCESORIES,
  ERROR_SERVICE_ACCESORY_CONFIG,
  ACCESSORY_SWITCH,
  PACKAGE_NAME
} = require('./statics')

class Accessories {
  constructor (dpmcPlugin) {
    this.plugin = dpmcPlugin
  }

  getDefaultSwitches (service, abilities) {
    // Abilities with no defined data that have an action can be considered as Domapic "Switches with no state". Will return false as state always
    // Abilities with boolean data that have state and action can be considered as homebridge "switches"
    const validAbilities = abilities.filter(ability =>
      (ability.type === 'boolean' && ability.state === true && ability.action === true) ||
      (ability.type === undefined && ability.action === true)
    )
    return validAbilities.map(ability => {
      const hasState = ability.type === 'boolean'
      return {
        accessory: ACCESSORY_SWITCH,
        name: `${service.name} ${ability.name}`,
        characteristics: [
          {
            characteristic: 'On',
            set: {
              ability: ability.name
            },
            get: {
              ability: hasState ? ability.name : null,
              fixture: hasState ? null : false
            }
          }
        ]
      }
    })
  }

  async createDefaultConfig (service, serviceAbilities) {
    const defaultConfig = {
      accessories: this.getDefaultSwitches(service, serviceAbilities)
    }
    await this.plugin.controller.servicePluginConfigs.create({
      pluginPackageName: PACKAGE_NAME,
      _service: service._id,
      config: defaultConfig
    })
    return {
      config: defaultConfig
    }
  }

  async getServiceConfig (service) {
    return this.plugin.controller.servicePluginConfigs.get({
      'plugin-package-name': PACKAGE_NAME,
      service
    })
  }

  getCharacteristicConfigData (characteristicMethodConfig, serviceAbilities) {
    if (!characteristicMethodConfig) {
      return null
    }
    if (characteristicMethodConfig.ability) {
      const ability = serviceAbilities.find(ability => ability.name === characteristicMethodConfig.ability)
      return {
        ability: ability._id,
        dataType: ability.type
      }
    }
    return {
      fixture: characteristicMethodConfig.fixture
    }
  }

  getServiceAccessoryConfig (service, serviceAbilities, serviceConfig) {
    return serviceConfig.accessories.map(accessoryConfig => ({
      service,
      accessory: accessoryConfig.accessory,
      name: `${accessoryConfig.name || accessoryConfig.accessory} ${service.name}`,
      characteristics: accessoryConfig.characteristics.map(characteristicConfig => ({
        characteristic: characteristicConfig.characteristic,
        get: this.getCharacteristicConfigData(characteristicConfig.get, serviceAbilities),
        set: this.getCharacteristicConfigData(characteristicConfig.set, serviceAbilities),
        notify: this.getCharacteristicConfigData(characteristicConfig.notify, serviceAbilities)
      }))
    })).filter(accessory => accessory.characteristics.length > 0)
  }

  async get () {
    await this.plugin.tracer.info(LOADING_ACCESORIES)
    const abilities = await this.plugin.controller.abilities.get()
    const services = await this.plugin.controller.services.get()

    return flatten(compact(await Promise.all(services.map(async service => {
      let serviceAccessoryConfig
      let serviceConfig = await this.getServiceConfig(service._id)
      const serviceAbilities = abilities.filter(ability => ability._service === service._id)
      if (!serviceConfig.length) {
        serviceConfig = await this.createDefaultConfig(service, serviceAbilities)
      } else {
        serviceConfig = serviceConfig[0]
      }
      try {
        serviceAccessoryConfig = await this.getServiceAccessoryConfig(service, serviceAbilities, serviceConfig.config)
      } catch (err) {
        await this.plugin.tracer.error(ERROR_SERVICE_ACCESORY_CONFIG, err)
        serviceAccessoryConfig = null
      }
      return serviceAccessoryConfig
    }))))
  }
}

module.exports = Accessories
