const test = require('narval')

const mockery = require('../mockery')

const MODULE = './NotificationsBridge'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const instanceStubs = {
    getPluginNotifier: sandbox.stub().returns({
      getEmitter: sandbox.stub().returns({
        on: sandbox.stub()
      })
    }),
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
      instance: instanceStubs
    }
  }
}

module.exports = Mock
