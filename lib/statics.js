'use strict'

const path = require('path')

const PACKAGE_PATH = path.resolve(__dirname, '..')
const HOMEBRIDGE_PATH = path.resolve(PACKAGE_PATH, '.homebridge')

const DOMAPIC = 'Domapic'

module.exports = {
  DOMAPIC,
  LOADING_ABILITIES: 'Loading abilities from Controller',
  WRITING_HOMEBRIDGE_CONFIG: 'Writing Homebridge configuration file',
  HOMEBRIDGE_LOG: '[Homebrigde log]',
  HOMEBRIDGE_ERROR: 'ERROR:',
  HOMEBRIDGE_EXITED: 'Homebridge exited with code',
  HOMEBRIDGE_STOPPING: 'Stopping Homebridge server',
  HOMEBRIDGE_STARTING: 'Starting Homebridge server',
  PACKAGE_PATH,
  HOMEBRIDGE_PATH,

  ACCESORY_SWITCH_NAME: `${DOMAPIC}Switch`
}
