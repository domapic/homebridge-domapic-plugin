const test = require('narval')

const mockery = require('../../../mockery')

const MODULE = './common/CharacteristicMethods'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const instanceStubs = {
    get: sandbox.stub().resolves(),
    set: sandbox.stub().resolves(),
    emitter: {
      on: sandbox.stub().resolves()
    }
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