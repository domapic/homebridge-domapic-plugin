const test = require('narval')

const mockery = require('../../mockery')

const MODULE = './lib/api/AbilitiesBridge'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const instanceStubs = {
    operations: sandbox.stub()
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
