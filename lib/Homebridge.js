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
  HOMEBRIDGE_STARTING,
  PACKAGE_PATH,
  HOMEBRIDGE_PATH
} = require('./statics')

class HomeBridge {
  constructor (dpmcPlugin) {
    this.tracer = dpmcPlugin.tracer
    this.process = null
    this.binPath = path.resolve(PACKAGE_PATH, 'node_modules', '.bin', 'homebridge')
    this.libPath = path.resolve(__dirname)
    this.pluginPath = path.resolve(PACKAGE_PATH, 'plugin')
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
      HOMEBRIDGE_PATH,
      '-P',
      this.pluginPath
    ], {
      cwd: PACKAGE_PATH,
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
            this.process = null
            resolve()
          }
        })
      })
    }
    return Promise.resolve()
  }

  async restart () {
    await this.stop()
    return this.start()
  }
}

module.exports = HomeBridge
