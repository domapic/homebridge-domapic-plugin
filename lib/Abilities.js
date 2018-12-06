'use strict'

class Abilities {
  constructor (dpmcPlugin) {
    this.plugin = dpmcPlugin
  }

  async get () {
    const abilities = await this.plugin.controller.abilities.get()
    const services = await this.plugin.controller.services.get()

    return abilities.map(ability => {
      return {
        ...ability,
        service: {...services.find(service => service._id === ability._service)}
      }
    })
  }
}

module.exports = Abilities
