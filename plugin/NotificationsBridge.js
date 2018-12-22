'use strict'

const EventEmitter = require('events')

const bodyParser = require('body-parser')
const express = require('express')
const _ = require('lodash')
const Boom = require('boom')

const { NOTIFY_EVENT, API_KEY_HEADER } = require('../lib/statics')

class NotificationsEmitter extends EventEmitter {}

class Server {
  constructor () {
    this._app = express()
    this._app.use(bodyParser.json())
    this.init = _.debounce(this.init.bind(this), 5000)

    this.getPluginNotifier = this.getPluginNotifier.bind(this)
  }

  init () {
    this._app.use('*', this.notFound.bind(this))
    this._app.use(this.errorHandler.bind(this))

    this._app.listen(this._port, () => {
      console.log(`Notifications bridge server started and listening at port ${this._port}`)
    })
  }

  checkApiKey (req, res, next) {
    if (req.headers[API_KEY_HEADER] === this._apiKey) {
      next()
    } else {
      next(Boom.unauthorized())
    }
  }

  notFound (req, res, next) {
    next(Boom.notFound())
  }

  errorHandler (err, req, res, next) {
    const error = Boom.isBoom(err) ? err : Boom.badImplementation(err.message)
    console.log(`Notifications bridge error: ${error.output.statusCode}. Output ${JSON.stringify(error.output.payload)}`)
    res.status(error.output.statusCode).send(error.output.payload)
  }

  getPluginNotifier (name, logMethods) {
    const notificationsEmitter = new NotificationsEmitter()
    return {
      getEmitter: (ability, dataType) => {
        logMethods.log(`Adding notifications bridge for ability "${ability}"`)
        this._app.post(`/${ability}`, this.checkApiKey.bind(this), (req, res) => {
          const data = req.body.data
          logMethods.log(`Received event from ability "${ability}". Data: ${data}`)
          notificationsEmitter.emit(NOTIFY_EVENT, data)
          res.status(201).send()
        })
        return notificationsEmitter
      }
    }
  }

  set port (portNumber) {
    if (!this._port) {
      this._port = portNumber
    }
  }

  set apiKey (apiKey) {
    if (!this._apiKey) {
      this._apiKey = apiKey
    }
  }
}

module.exports = Server
