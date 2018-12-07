const test = require('narval')

const mockery = require('./mockery')

const MODULE = 'request-promise'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const stub = sandbox.stub().resolves()

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stub)

  return {
    restore,
    stub
  }
}

module.exports = Mock
