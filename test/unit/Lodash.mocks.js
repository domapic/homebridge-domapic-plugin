const test = require('narval')

const mockery = require('./mockery')

const { trim } = require('lodash')

const MODULE = 'lodash'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()
  let debounceCallback

  const stubs = {
    debounce: sandbox.stub().callsFake(cb => {
      debounceCallback = cb
    }),
    delay: sandbox.stub().callsFake(cb => cb()),
    trim
  }

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stubs)

  return {
    restore,
    stubs,
    utils: {
      getDebounceCallback: () => debounceCallback
    }
  }
}

module.exports = Mock
