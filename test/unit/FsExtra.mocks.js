const test = require('narval')

const mockery = require('./mockery')

const MODULE = 'fs-extra'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const stubs = {
    copy: sandbox.stub().resolves(),
    writeJson: sandbox.stub().resolves()
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
