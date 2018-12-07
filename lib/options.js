'use strict'

const { HOMEBRIDGE_PORT } = require('./statics')

module.exports = {
  [HOMEBRIDGE_PORT]: {
    type: 'number',
    alias: ['homebridge-port', 'bridgePort', 'bridge-port'],
    describe: 'Defines port for the Homebridge server',
    default: 51826
  }
}
