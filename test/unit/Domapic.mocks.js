const test = require('narval')

const mockery = require('./mockery')

const MODULE = 'domapic-service'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()
  let resolveStartCalled

  const startHasBeenCalledPromise = new Promise(resolve => {
    resolveStartCalled = resolve
  })

  const pluginStubs = {
    start: sandbox.stub().callsFake(() => {
      resolveStartCalled()
      return Promise.resolve()
    }),
    config: {
      get: sandbox.stub().resolves()
    },
    storage: {
      get: sandbox.stub().resolves(),
      set: sandbox.stub().resolves(),
      getPath: sandbox.stub().resolves('')
    },
    tracer: {
      info: sandbox.stub().resolves(),
      debug: sandbox.stub().resolves(),
      error: sandbox.stub().resolves()
    },
    events: {
      on: sandbox.stub(),
      once: sandbox.stub()
    },
    api: {
      extendOpenApi: sandbox.stub().resolves(),
      addOperations: sandbox.stub().resolves()
    },
    controller: {
      abilities: {
        get: sandbox.stub().resolves(),
        action: sandbox.stub().resolves(),
        state: sandbox.stub().resolves()
      },
      services: {
        get: sandbox.stub().resolves()
      },
      servicePluginConfigs: {
        create: sandbox.stub().resolves(),
        get: sandbox.stub().resolves()
      }
    }
  }

  const stubs = {
    createPlugin: sandbox.stub().resolves(pluginStubs),
    cli: sandbox.stub()
  }

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stubs)

  return {
    restore,
    stubs: {
      ...stubs,
      plugin: pluginStubs
    },
    utils: {
      startHasBeenCalled: () => startHasBeenCalledPromise
    }
  }
}

module.exports = Mock
