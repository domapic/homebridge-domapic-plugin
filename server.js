'use strict'

const path = require('path')

const domapic = require('domapic-service')
const { debounce } = require('lodash')

const options = require('./lib/options')

const abilitiesBridgeApi = require('./lib/api/abilities-bridge.json')
const Abilities = require('./lib/Abilities')
const AbilitiesBridge = require('./lib/api/AbilitiesBridge')
const Homebridge = require('./lib/Homebridge')
const HomebridgeConfig = require('./lib/HomebridgeConfig')

domapic.createPlugin({
  packagePath: path.resolve(__dirname),
  customConfig: options
}).then(async dmpcPlugin => {
  const abilities = new Abilities(dmpcPlugin)
  const abilitiesBridge = new AbilitiesBridge(dmpcPlugin)
  const homebridge = new Homebridge(dmpcPlugin)
  const homebridgeConfig = new HomebridgeConfig(dmpcPlugin)

  const restartHomebridge = debounce(async (event) => {
    await homebridgeConfig.write(await abilities.get())
    homebridge.restart()
  }, 5000)

  dmpcPlugin.events.on('ability:updated', restartHomebridge)
  dmpcPlugin.events.on('ability:created', restartHomebridge)
  dmpcPlugin.events.on('ability:deleted', restartHomebridge)
  dmpcPlugin.events.on('service:updated', restartHomebridge)
  dmpcPlugin.events.once('connection', restartHomebridge)

  await dmpcPlugin.api.extendOpenApi(abilitiesBridgeApi)
  await dmpcPlugin.api.addOperations(abilitiesBridge.operations())

  return dmpcPlugin.start()
})
