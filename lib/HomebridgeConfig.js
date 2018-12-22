'use strict'

const path = require('path')

const fsExtra = require('fs-extra')
const ip = require('ip')
const { cloneDeep, toUpper } = require('lodash')
const randomMac = require('random-mac')

const homebridgeConfig = require('./homebridge-config.json')
const notificationsApiKey = require('./notificationsApiKey')

const {
  HOMEBRIDGE_PATH,
  WRITING_HOMEBRIDGE_CONFIG,
  HOMEBRIDGE_PORT,
  NOTIFICATIONS_BRIDGE_PORT,
  HOMEBRIDGE_MAC_STORAGE_KEY
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
      apiKey: pluginApiKeys.find(apiKey => apiKey.role === 'admin').key,
      notificationsBridgePort: pluginConfig[NOTIFICATIONS_BRIDGE_PORT]
    }
  }

  getAccessoryConfig (accessoryData, pluginConnection) {
    return {
      accessory: accessoryData.accessory,
      abilitiesBridgeUrl: pluginConnection.url,
      apiKey: pluginConnection.apiKey,
      characteristics: accessoryData.characteristics,
      servicePackageName: accessoryData.service.package,
      serviceVersion: accessoryData.service.version,
      serviceName: accessoryData.service.name,
      serviceProcessId: accessoryData.service.processId,
      name: accessoryData.name,
      notificationsBridgePort: pluginConnection.notificationsBridgePort,
      notificationsApiKey
    }
  }

  async getAccessoriesConfig (accessories) {
    const pluginConnection = await this.getPluginConnection()
    return accessories.map(accessory => this.getAccessoryConfig(accessory, pluginConnection))
  }

  async getMac () {
    let mac
    try {
      mac = await this.plugin.storage.get(HOMEBRIDGE_MAC_STORAGE_KEY)
    } catch (err) {
      mac = toUpper(randomMac())
      await this.plugin.storage.set(HOMEBRIDGE_MAC_STORAGE_KEY, mac)
    }
    return mac
  }

  async write (accessories) {
    await this.tracer.info(WRITING_HOMEBRIDGE_CONFIG)
    await this.tracer.debug('Accessories', JSON.stringify(accessories, null, 2))
    const pluginConfig = await this.plugin.config.get()
    const homebridgePath = path.resolve(await this.plugin.storage.getPath(), HOMEBRIDGE_PATH)

    this.config = cloneDeep(homebridgeConfig)

    this.config.bridge.name = pluginConfig.name
    this.config.bridge.username = await this.getMac()
    this.config.bridge.port = pluginConfig[HOMEBRIDGE_PORT]
    this.config.accessories = await this.getAccessoriesConfig(accessories)

    fsExtra.ensureDirSync(homebridgePath)

    await fsExtra.writeJson(path.resolve(homebridgePath, 'config.json'), this.config, {
      spaces: 2
    })
  }
}

module.exports = Accesories
