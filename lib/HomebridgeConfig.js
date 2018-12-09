'use strict'

const path = require('path')

const fsExtra = require('fs-extra')
const ip = require('ip')
const { cloneDeep } = require('lodash')
const randomMac = require('random-mac')

const homebridgeConfig = require('./homebridge-config.json')

const {
  HOMEBRIDGE_PATH,
  WRITING_HOMEBRIDGE_CONFIG,
  HOMEBRIDGE_PORT,
  HOMEBRIDGE_MAC_STORAGE_KEY,

  ACCESORY_SWITCH_NAME,
  ACCESORY_STATELESS_SWITCH_NAME
} = require('./statics')

class Accesories {
  constructor (dpmcPlugin) {
    this.plugin = dpmcPlugin
    this.tracer = dpmcPlugin.tracer
  }

  async getPluginConnection () {
    const pluginConfig = await this.plugin.config.get()
    const pluginApiKeys = await this.plugin.storage.get('apiKeys')
    const host = pluginConfig.hostName.length ? pluginConfig.hostName : ip.address()
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

  getStatelessSwitchs (abilities, pluginConnection) {
    // Abilities with no defined data that have an action can be considered as Domapic "statelessSwitch", that will be mapped to homebridge "switches". Will return false as state always
    const switchValidAbilities = abilities.filter(ability => ability.type === undefined && ability.action === true)
    return switchValidAbilities.map(ability => {
      return {
        accessory: ACCESORY_STATELESS_SWITCH_NAME,
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
      ...this.getSwitchs(abilities, pluginConnection),
      ...this.getStatelessSwitchs(abilities, pluginConnection)
    ]
  }

  async getMac () {
    let mac
    try {
      mac = await this.plugin.storage.get(HOMEBRIDGE_MAC_STORAGE_KEY)
    } catch (err) {
      mac = randomMac()
      await this.plugin.storage.set(HOMEBRIDGE_MAC_STORAGE_KEY, mac)
    }
    return mac
  }

  async write (abilities) {
    await this.tracer.info(WRITING_HOMEBRIDGE_CONFIG)
    const pluginConfig = await this.plugin.config.get()
    const homebridgePath = path.resolve(await this.plugin.storage.getPath(), HOMEBRIDGE_PATH)

    this.config = cloneDeep(homebridgeConfig)

    this.config.bridge.name = pluginConfig.name
    this.config.bridge.username = await this.getMac()
    this.config.bridge.port = pluginConfig[HOMEBRIDGE_PORT]
    this.config.accessories = await this.getAccesories(abilities)

    fsExtra.ensureDirSync(homebridgePath)

    await fsExtra.writeJson(path.resolve(homebridgePath, 'config.json'), this.config, {
      spaces: 2
    })
  }
}

module.exports = Accesories
