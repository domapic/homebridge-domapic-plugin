'use strict'

const path = require('path')

const fsExtra = require('fs-extra')
const ip = require('ip')
const { cloneDeep } = require('lodash')

const homebridgeConfig = require('./homebridge-config.json')

const {
  HOMEBRIDGE_PATH,
  WRITING_HOMEBRIDGE_CONFIG,

  ACCESORY_SWITCH_NAME
} = require('./statics')

class Accesories {
  constructor (dpmcPlugin) {
    this.configPath = path.resolve(HOMEBRIDGE_PATH, 'config.json')
    this.plugin = dpmcPlugin
    this.tracer = dpmcPlugin.tracer
  }

  async getPluginConnection () {
    const pluginConfig = await this.plugin.config.get()
    const pluginApiKeys = await this.plugin.storage.get('apiKeys')
    const host = pluginConfig.hostName.length ? pluginConfig.host : ip.address()
    const secureProtocolSuffix = pluginConfig.sslCert ? 's' : ''
    const port = pluginConfig.port

    return {
      url: `http${secureProtocolSuffix}://${host}:${port}/api/controller/abilities/`,
      apiKey: pluginApiKeys.find(apiKey => apiKey.role === 'admin').key
    }
  }

  getSwitchs (abilities, pluginConnection) {
    // Abilities with boolean data that have state and action can be considered as homebridge "switches"
    const switchValidAbilities = abilities.filter(ability => ability.type === 'boolean' && ability.state === true && ability.action === true)
    return switchValidAbilities.map(ability => {
      return {
        accessory: ACCESORY_SWITCH_NAME,
        apiKey: pluginConnection.apiKey,
        bridgeUrl: `${pluginConnection.url}${ability._id}`,
        servicePackageName: ability.service.package,
        serviceName: ability.service.name,
        serviceProcessId: ability.service.processId,
        abilityName: ability.name,
        name: `${ability.service.name} ${ability.name}`
      }
    })
  }

  async getAccesories (abilities) {
    const pluginConnection = await this.getPluginConnection()
    return [
      ...this.getSwitchs(abilities, pluginConnection)
    ]
  }

  async write (abilities) {
    await this.tracer.info(WRITING_HOMEBRIDGE_CONFIG)
    this.config = cloneDeep(homebridgeConfig)
    this.config.accessories = await this.getAccesories(abilities)
    await fsExtra.writeJson(this.configPath, this.config, {
      spaces: 2
    })
  }
}

module.exports = Accesories
