'use strict'

const path = require('path')

const PACKAGE_PATH = path.resolve(__dirname, '..')

const DOMAPIC = 'Domapic'

module.exports = {
  DOMAPIC,
  LOADING_ABILITIES: 'Loading abilities from Controller',
  WRITING_HOMEBRIDGE_CONFIG: 'Writing Homebridge configuration file',
  HOMEBRIDGE_MAC_STORAGE_KEY: 'username_mac',
  HOMEBRIDGE_LOG: '[Homebrigde log]',
  HOMEBRIDGE_ERROR: 'ERROR:',
  HOMEBRIDGE_EXITED: 'Homebridge exited with code',
  HOMEBRIDGE_STOPPING: 'Stopping Homebridge server',
  HOMEBRIDGE_STARTING: 'Starting Homebridge server',
  HOMEBRIDGE_PATH: 'homebridge',
  HOMEBRIDGE_PORT: 'homebridgePort',
  PACKAGE_PATH,

  SENDING_ABILITY_ACTION: `Sending action to ability`,
  GETTING_ABILITY_STATE: `Getting state of ability`,

  ACCESORY_SWITCH_NAME: `${DOMAPIC}Switch`,
  ACCESORY_STATELESS_SWITCH_NAME: `${DOMAPIC}StatelessSwitch`
}
