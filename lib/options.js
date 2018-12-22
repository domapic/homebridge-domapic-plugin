'use strict'

const { HOMEBRIDGE_PORT, NOTIFICATIONS_BRIDGE_PORT } = require('./statics')

module.exports = {
  [HOMEBRIDGE_PORT]: {
    type: 'number',
    alias: ['homebridge-port', 'bridgePort', 'bridge-port'],
    describe: 'Defines port for the Homebridge server',
    default: 51826
  },
  [NOTIFICATIONS_BRIDGE_PORT]: {
    type: 'number',
    alias: ['notifications-bridge-port', 'notificationsPort', 'notifications-port'],
    describe: 'Defines port for the Plugins notifications bridge server',
    default: 51827
  }
}
