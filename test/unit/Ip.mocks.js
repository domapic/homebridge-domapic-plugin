const test = require('narval')

const mockery = require('./mockery')

const MODULE = 'ip'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const stubs = {
    address: sandbox.stub()
  }

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stubs)

  return {
    restore,
    stubs
  }
}

module.exports = Mock
