'use strict'

class AbilitiesBridge {
  constructor (dpmcPlugin) {
    this.plugin = dpmcPlugin

    this.actionOperationHandler = this.actionOperationHandler.bind(this)
    this.stateOperationHandler = this.stateOperationHandler.bind(this)
  }

  actionOperationHandler (params, body) {
    // TODO, add debug trace
    return this.plugin.controller.abilities.action(params.path.id, body)
  }

  stateOperationHandler (params) {
    // TODO, add debug trace
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
