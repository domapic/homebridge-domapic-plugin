const test = require('narval')

const mockery = require('./mockery')

const MODULE = 'child_process'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()
  let stdoutCallback
  let stderrCallback
  let closeCallback

  const spawnStubs = {
    stdout: {
      on: sandbox.stub().callsFake((eventName, cb) => {
        stdoutCallback = cb
      })
    },
    stderr: {
      on: sandbox.stub().callsFake((eventName, cb) => {
        stderrCallback = cb
      })
    },
    on: sandbox.stub().callsFake((eventName, cb) => {
      closeCallback = cb
    })
  }

  const stubs = {
    spawn: sandbox.stub().returns(spawnStubs)
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
      getStdoutCallback: () => stdoutCallback,
      getStderrCallback: () => stderrCallback,
      getCloseCallback: () => closeCallback
    }
  }
}

module.exports = Mock
