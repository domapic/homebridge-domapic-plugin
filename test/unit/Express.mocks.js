const test = require('narval')

const mockery = require('./mockery')

const MODULE = 'express'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const instance = {
    use: sandbox.stub(),
    listen: sandbox.stub(),
    post: sandbox.stub()
  }

  const stub = sandbox.stub().callsFake(() => {
    return instance
  })

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stub)

  return {
    restore,
    stub,
    instance
  }
}

module.exports = Mock
