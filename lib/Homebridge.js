'use strict'

const path = require('path')
const childProcess = require('child_process')

const { trim } = require('lodash')
const kill = require('tree-kill')
const fsExtra = require('fs-extra')

const {
  HOMEBRIDGE_LOG,
  HOMEBRIDGE_EXITED,
  HOMEBRIDGE_STOPPING,
  HOMEBRIDGE_STARTING
} = require('./statics')

class HomeBridge {
  constructor (dpmcPlugin) {
    this.tracer = dpmcPlugin.tracer
    this.process = null
    this.packagePath = path.resolve(__dirname, '..')
    this.binPath = path.resolve(this.packagePath, 'node_modules', '.bin', 'homebridge')
    this.libPath = path.resolve(__dirname)
    this.homebridgePath = path.resolve(this.packagePath, '.homebridge')
    this.pluginPath = path.resolve(this.packagePath, 'plugin')
    this.pluginPackageJsonOrigin = path.resolve(this.libPath, 'plugin-package.json')
    this.pluginPackageJsonDest = path.resolve(this.pluginPath, 'package.json')

    this.start = this.start.bind(this)
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

  async writePackageJson () {
    await fsExtra.copy(this.pluginPackageJsonOrigin, this.pluginPackageJsonDest)
  }

  async start () {
    await this.tracer.info(HOMEBRIDGE_STARTING)
    await this.writePackageJson()
    this.process = childProcess.spawn(this.binPath, [
      '-D',
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
      this.log(`${HOMEBRIDGE_EXITED} ${code}`, 'info')
      this.process = null
    })
  }

  async stop () {
    if (this.process) {
      await this.tracer.info(HOMEBRIDGE_STOPPING)
      return new Promise((resolve, reject) => {
        kill(this.process.pid, error => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      })
    }
    return Promise.resolve()
  }

  async restart (abilities) {
    console.log(abilities)
    await this.stop()
    return this.start()
  }
}

module.exports = HomeBridge
