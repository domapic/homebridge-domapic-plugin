'use strict'

const path = require('path')
const childProcess = require('child_process')

const { trim } = require('lodash')

// process.title = 'homebridge';

const HOMEBRIDGE_LOG = '[Homebrigde log]'

class HomeBridge {
  constructor (dpmcPlugin) {
    this.tracer = dpmcPlugin.tracer
    this.process = null
    this.packagePath = path.resolve(__dirname, '..')
    this.binPath = path.resolve(this.packagePath, 'node_modules', '.bin', 'homebridge')
    this.homebridgePath = path.resolve(this.packagePath, '.homebridge') // TODO, move to domapic storage path
    this.pluginPath = path.resolve(this.packagePath, 'plugin')
  }

  log (data, method) {
    let cleanData = trim(data.toString())
    if (cleanData.length) {
      if (cleanData.split('\n').length > 1) {
        cleanData = `\n${cleanData}`
      }
      this.tracer[method](`${HOMEBRIDGE_LOG} ${cleanData}`)
    }
  }

  start () {
    if (!this.process) {
      this.process = childProcess.spawn(this.binPath, [
        '-U',
        this.homebridgePath,
        '-P',
        this.pluginPath
      ], {
        cwd: this.packagePath,
        encoding: 'utf8'
      })

      this.process.stdout.on('data', data => {
        this.log(data, 'info')
      })

      this.process.stderr.on('data', data => {
        this.log(data, 'error')
      })

      this.process.on('close', code => {
        this.log(`Homebridge exited with code ${code}`, 'info')
        this.process = null
      })
    }
  }
}

module.exports = HomeBridge
