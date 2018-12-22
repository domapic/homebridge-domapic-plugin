const test = require('narval')

const mockery = require('../mockery')

const MODULE = './NotificationsBridge'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const pluginStubs = {
    getEmitter: sandbox.stub().returns({
      on: sandbox.stub()
    })
  }

  const instanceStubs = {
    getPluginNotifier: sandbox.stub().returns(pluginStubs),
    init: sandbox.stub()
  }

  const stub = sandbox.stub().callsFake(function () {
    return instanceStubs
  })

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stub)

  return {
    restore,
    stubs: {
      Constructor: stub,
      instance: instanceStubs,
      plugin: pluginStubs
    }
  }
}

module.exports = Mock
