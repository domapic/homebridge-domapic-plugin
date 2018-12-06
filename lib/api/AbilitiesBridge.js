'use strict'

const { SENDING_ABILITY_ACTION, GETTING_ABILITY_STATE } = require('../statics')

class AbilitiesBridge {
  constructor (dpmcPlugin) {
    this.plugin = dpmcPlugin

    this.actionOperationHandler = this.actionOperationHandler.bind(this)
    this.stateOperationHandler = this.stateOperationHandler.bind(this)
  }

  actionOperationHandler (params, body) {
    this.plugin.tracer.debug(`${SENDING_ABILITY_ACTION} ${params.path.id}`, body)
    return this.plugin.controller.abilities.action(params.path.id, body)
  }

  stateOperationHandler (params) {
    this.plugin.tracer.debug(`${GETTING_ABILITY_STATE} ${params.path.id}`)
    return this.plugin.controller.abilities.state(params.path.id)
  }

  operations () {
    return {
      abilityActionHandler: {
        handler: this.actionOperationHandler
      },
      abilityStateHandler: {
        handler: this.stateOperationHandler
      }
    }
  }
}

module.exports = AbilitiesBridge
