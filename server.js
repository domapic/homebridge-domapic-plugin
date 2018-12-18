'use strict'

const path = require('path')

const domapic = require('domapic-service')
const { debounce } = require('lodash')

const options = require('./lib/options')

const abilitiesBridgeApi = require('./lib/api/abilities-bridge.json')
const Accessories = require('./lib/Accessories')
const AbilitiesBridge = require('./lib/api/AbilitiesBridge')
const Homebridge = require('./lib/Homebridge')
const HomebridgeConfig = require('./lib/HomebridgeConfig')

domapic.createPlugin({
  packagePath: path.resolve(__dirname),
  customConfig: options
}).then(async dmpcPlugin => {
  const accessories = new Accessories(dmpcPlugin)
  const abilitiesBridge = new AbilitiesBridge(dmpcPlugin)
  const homebridge = new Homebridge(dmpcPlugin)
  const homebridgeConfig = new HomebridgeConfig(dmpcPlugin)

  const restartHomebridge = debounce(async (event) => {
    await homebridgeConfig.write(await accessories.get())
    homebridge.restart()
  }, 10000)

  dmpcPlugin.events.on('service:updated', restartHomebridge)
  dmpcPlugin.events.on('service:created', restartHomebridge)
  dmpcPlugin.events.on('service:deleted', restartHomebridge)
  dmpcPlugin.events.on('servicePluginConfig:created', restartHomebridge)
  dmpcPlugin.events.on('servicePluginConfig:updated', restartHomebridge)
  dmpcPlugin.events.on('servicePluginConfig:deleted', restartHomebridge)
  dmpcPlugin.events.on('ability:updated', restartHomebridge)
  dmpcPlugin.events.on('ability:created', restartHomebridge)
  dmpcPlugin.events.on('ability:deleted', restartHomebridge)
  dmpcPlugin.events.once('connection', restartHomebridge)

  await dmpcPlugin.api.extendOpenApi(abilitiesBridgeApi)
  await dmpcPlugin.api.addOperations(abilitiesBridge.operations())

  return dmpcPlugin.start()
})
