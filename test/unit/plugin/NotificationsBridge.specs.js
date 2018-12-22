const test = require('narval')

const Boom = require('boom')

const ExpressMocks = require('../Express.mocks')

test.describe('Notifications Bridge', () => {
  let sandbox
  let NotificationsBridge
  let notificationsBridge
  let express
  let lodash
  let sendSpy
  let resMock

  test.before(() => {
    sandbox = test.sinon.createSandbox()
    express = new ExpressMocks()
    lodash = require('lodash')
    lodash = sandbox.stub(lodash, 'debounce').callsFake(cb => cb)
    sandbox.spy(console, 'log')
    sendSpy = sandbox.spy()
    resMock = {
      status: sandbox.stub().returns({
        send: sendSpy
      })
    }
    NotificationsBridge = require('../../../plugin/NotificationsBridge')
    notificationsBridge = new NotificationsBridge()
  })

  test.after(() => {
    express.restore()
    sandbox.restore()
  })

  test.describe('port setter', () => {
    const fooPort = 12345

    test.it('should set port number', () => {
      notificationsBridge.port = fooPort
      test.expect(notificationsBridge._port).to.equal(fooPort)
    })

    test.it('should not set port number more than once', () => {
      notificationsBridge.port = 3123123
      test.expect(notificationsBridge._port).to.equal(fooPort)
    })
  })

  test.describe('apiKey setter', () => {
    const fooApiKey = 'foo'

    test.it('should set apiKey', () => {
      notificationsBridge.apiKey = fooApiKey
      test.expect(notificationsBridge._apiKey).to.equal(fooApiKey)
    })

    test.it('should not set apiKey more then once', () => {
      notificationsBridge.apiKey = 'foo-2'
      test.expect(notificationsBridge._apiKey).to.equal(fooApiKey)
    })
  })

  test.describe('init method', () => {
    test.it('should init express server listening to defined port', () => {
      notificationsBridge = new NotificationsBridge()
      notificationsBridge.port = 342
      notificationsBridge.init()
      test.expect(express.instance.listen.getCall(0).args[0]).to.equal(342)
    })

    test.it('should print a log when server has started', () => {
      notificationsBridge = new NotificationsBridge()
      notificationsBridge.port = 342
      notificationsBridge.init()
      const initCallback = express.instance.listen.getCall(0).args[1]
      initCallback()
      test.expect(console.log).to.have.been.calledWith('Notifications bridge server started and listening at port 342')
    })
  })

  test.describe('checkApiKey middleware', () => {
    test.it('should call to next middleware if header api key matchs with provided api key', () => {
      notificationsBridge = new NotificationsBridge()
      notificationsBridge.apiKey = 'foo'
      const spy = sandbox.spy()
      notificationsBridge.checkApiKey({
        headers: {
          'x-api-key': 'foo'
        }
      }, {}, spy)
      test.expect(spy.getCall(0).args[0]).to.be.undefined()
    })

    test.it('should call to next middleware with an error if header api key does not match with provided api key', () => {
      notificationsBridge = new NotificationsBridge()
      notificationsBridge.apiKey = 'foo'
      const spy = sandbox.spy()
      notificationsBridge.checkApiKey({
        headers: {
          'x-api-key': 'foo-2'
        }
      }, {}, spy)
      test.expect(spy.getCall(0).args[0]).to.be.an.instanceOf(Error)
    })
  })

  test.describe('notFound middleware', () => {
    test.it('should call to next middleware with a not found error', () => {
      const spy = sandbox.spy()
      notificationsBridge.notFound({}, {}, spy)
      test.expect(spy.getCall(0).args[0]).to.be.instanceOf(Error)
      test.expect(spy.getCall(0).args[0].output.statusCode).to.equal(404)
    })
  })

  test.describe('errorHandler middleware', () => {
    test.it('should set status code from received error if it is a Boom error', () => {
      notificationsBridge.errorHandler(Boom.notFound(), {}, resMock)
      test.expect(resMock.status).to.have.been.calledWith(404)
    })

    test.it('should return a badImplementation error if received error is not Boom', () => {
      notificationsBridge.errorHandler(new Error(), {}, resMock)
      test.expect(resMock.status).to.have.been.calledWith(500)
    })
  })

  test.describe('pluginNotifier method', () => {
    test.it('should return a getEmitter method', () => {
      test.expect(notificationsBridge.getPluginNotifier().getEmitter).to.not.be.undefined()
    })

    test.describe('getEmitter method', () => {
      const fooAccesoryName = 'foo-accessory'
      let getEmitter
      let logMethods

      test.beforeEach(() => {
        logMethods = {
          log: sandbox.spy()
        }
        getEmitter = notificationsBridge.getPluginNotifier(fooAccesoryName, logMethods).getEmitter
      })

      test.it('should add an express route for received ability', () => {
        getEmitter('foo-id')
        test.expect(express.instance.post.getCall(0).args[0]).to.equal('/foo-id')
      })

      test.describe('ability middleware', () => {
        let middleware
        let emitter
        test.before(() => {
          emitter = getEmitter('foo-id')
          middleware = express.instance.post.getCall(0).args[2]
        })

        test.it('should emit an event with received data', done => {
          emitter.on('notify', data => {
            test.expect(data).to.equal(true)
            done()
          })
          middleware({
            body: {
              data: true
            }
          }, resMock)
        })
      })
    })
  })
})
