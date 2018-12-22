'use strict'

const path = require('path')

const PACKAGE_PATH = path.resolve(__dirname, '..')

const DOMAPIC = 'Domapic'

module.exports = {
  DOMAPIC,
  PACKAGE_NAME: 'homebridge-domapic-plugin',
  LOADING_ACCESORIES: 'Loading accesories correspondences from Controller',
  ERROR_SERVICE_ACCESORY_CONFIG: 'Error in service accessory configuration',
  WRITING_HOMEBRIDGE_CONFIG: 'Writing Homebridge configuration file',
  HOMEBRIDGE_MAC_STORAGE_KEY: 'username_mac',
  HOMEBRIDGE_LOG: '[Homebrigde log]',
  HOMEBRIDGE_ERROR: 'ERROR:',
  HOMEBRIDGE_EXITED: 'Homebridge exited with code',
  HOMEBRIDGE_STOPPING: 'Stopping Homebridge server',
  HOMEBRIDGE_STARTING: 'Starting Homebridge server',
  HOMEBRIDGE_PATH: 'homebridge',
  HOMEBRIDGE_PORT: 'homebridgePort',
  NOTIFICATIONS_BRIDGE_PORT: 'notificationsBridgePort',
  NOTIFY_EVENT: 'notify',
  PACKAGE_PATH,

  SENDING_ABILITY_ACTION: `Sending action to ability`,
  GETTING_ABILITY_STATE: `Getting state of ability`,

  ACCESSORY_SWITCH: 'Switch',
  ACCESSORY_CONTACT_SENSOR: 'ContactSensor',

  API_KEY_HEADER: 'x-api-key'
}
