const test = require('narval')

const mockery = require('./mockery')

const MODULE = 'tree-kill'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()
  let executeCallback = false
  let callbackValue = null
  let callback

  const stub = sandbox.stub().callsFake((pid, cb) => {
    callback = cb
    if (executeCallback) {
      cb(callbackValue)
    }
  })

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stub)

  return {
    restore,
    stub,
    utils: {
      getCallback: () => callback,
      executeCallback: (execute, value) => {
        executeCallback = execute
        callbackValue = value
      }
    }
  }
}

module.exports = Mock
