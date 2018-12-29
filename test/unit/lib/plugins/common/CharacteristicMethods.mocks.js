const test = require('narval')

const mockery = require('../../../mockery')

const MODULE = './common/CharacteristicMethods'
const MODULE_2 = './CharacteristicMethods'

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
    mockery.deregister(MODULE_2)
  }

  mockery.register(MODULE, stub)
  mockery.register(MODULE_2, stub)

  return {
    restore,
    stubs: {
      Constructor: stub,
      instance: instanceStubs
    }
  }
}

module.exports = Mock
