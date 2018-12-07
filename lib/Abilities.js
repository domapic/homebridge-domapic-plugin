'use strict'

const {
  LOADING_ABILITIES
} = require('./statics')

class Abilities {
  constructor (dpmcPlugin) {
    this.plugin = dpmcPlugin
  }

  async get () {
    const abilities = await this.plugin.controller.abilities.get()
    const services = await this.plugin.controller.services.get()
    await this.plugin.tracer.info(LOADING_ABILITIES)
    return abilities.map(ability => {
      return {
        ...ability,
        service: {...services.find(service => service._id === ability._service)}
      }
    })
  }
}

module.exports = Abilities
