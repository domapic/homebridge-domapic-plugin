'use strict'

const path = require('path')

const domapic = require('domapic-service')
const { debounce } = require('lodash')

const Homebridge = require('./lib/Homebridge')
const Abilities = require('./lib/Abilities')

domapic.createPlugin({
  packagePath: path.resolve(__dirname)
}).then(dmpcPlugin => {
  const homebridge = new Homebridge(dmpcPlugin)
  const abilities = new Abilities(dmpcPlugin)

  const startHomebridge = debounce(async () => {
    homebridge.restart(await abilities.get())
  }, 5000)

  dmpcPlugin.events.on('ability:updated', startHomebridge)
  dmpcPlugin.events.on('ability:created', startHomebridge)
  dmpcPlugin.events.on('ability:deleted', startHomebridge)
  dmpcPlugin.events.on('service:updated', startHomebridge)
  dmpcPlugin.events.on('connection', startHomebridge)

  return dmpcPlugin.start()
})
