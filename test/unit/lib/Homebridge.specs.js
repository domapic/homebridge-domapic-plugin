const path = require('path')

const test = require('narval')

const DomapicMocks = require('../Domapic.mocks')
const ChildProcessMocks = require('../ChildProcess.mocks')
const TreeKillMocks = require('../TreeKill.mocks')
const FsExtraMocks = require('../FsExtra.mocks')

test.describe('HomeBridge', () => {
  const PRE_LOG = '[Homebrigde log]'
  let Homebridge
  let homebridge
  let childProcess
  let treeKill
  let fsExtra
  let domapic

  test.beforeEach(() => {
    domapic = new DomapicMocks()
    childProcess = new ChildProcessMocks()
    treeKill = new TreeKillMocks()
    fsExtra = new FsExtraMocks()
    Homebridge = require('../../../lib/Homebridge')
    homebridge = new Homebridge(domapic.stubs.plugin)
  })

  test.afterEach(() => {
    childProcess.restore()
    domapic.restore()
    treeKill.restore()
    fsExtra.restore()
  })

  test.describe('start method', () => {
    const packagePath = path.resolve(__dirname, '..', '..', '..')
    const pluginPath = path.resolve(packagePath, 'plugin')
    const binPath = path.resolve(packagePath, 'node_modules', '.bin', 'homebridge')
    const homebridgePath = path.resolve(packagePath, '.homebridge')

    test.it('should copy the plugin package.json file to the plugin folder', () => {
      const origin = path.resolve(packagePath, 'lib', 'plugin-package.json')
      const dest = path.resolve(pluginPath, 'package.json')
      return homebridge.start()
        .then(() => {
          return test.expect(fsExtra.stubs.copy).to.have.been.calledWith(origin, dest)
        })
    })

    test.it('should start a Homebridge child process', () => {
      return homebridge.start()
        .then(() => {
          const args = childProcess.stubs.spawn.getCall(0).args
          const homebridgeBin = args[0]
          const homebridgeArgs = args[1].join(' ')
          return Promise.all([
            test.expect(homebridgeBin).to.equal(binPath),
            test.expect(homebridgeArgs).to.equal(`-U ${homebridgePath} -P ${pluginPath}`)
          ])
        })
    })

    test.describe('when data is received from Homebridge process', () => {
      test.it('should trace it using plugin tracer', () => {
        return homebridge.start()
          .then(() => {
            const stdoutCallback = childProcess.utils.getStdoutCallback()
            stdoutCallback(' This is a foo log  ')
            return test.expect(domapic.stubs.plugin.tracer.info.getCall(1).args[0]).to.equal('[Homebrigde log] This is a foo log')
          })
      })
    })

    test.describe('when error data is received from Homebridge process', () => {
      test.it('should trace it using plugin tracer', () => {
        return homebridge.start()
          .then(() => {
            const stderrCallback = childProcess.utils.getStderrCallback()
            stderrCallback(' This is a foo error  ')
            return test.expect(domapic.stubs.plugin.tracer.error.getCall(0).args[0]).to.equal(`${PRE_LOG} This is a foo error`)
          })
      })
    })

    test.describe('when Homebridge process is closed', () => {
      test.it('should trace the close code', () => {
        return homebridge.start()
          .then(() => {
            const closeCallback = childProcess.utils.getCloseCallback()
            closeCallback(0)
            return test.expect(domapic.stubs.plugin.tracer.info.getCall(1).args[0]).to.equal(`${PRE_LOG} Homebridge exited with code 0`)
          })
      })

      test.it('should set the process as null', () => {
        return homebridge.start()
          .then(() => {
            const closeCallback = childProcess.utils.getCloseCallback()
            closeCallback(0)
            return test.expect(homebridge.process).to.equal(null)
          })
      })
    })
  })

  test.describe('log method', () => {
    const LOG_METHOD = 'info'
    test.it('should not log data if it is empty', () => {
      homebridge.log('       ', LOG_METHOD)
      test.expect(domapic.stubs.plugin.tracer.info).to.not.have.been.called()
    })

    test.it('should add a new line at the beggining if data contains new lines characters', () => {
      homebridge.log('foo \n foo', LOG_METHOD)
      test.expect(domapic.stubs.plugin.tracer.info).to.have.been.calledWith(`${PRE_LOG} \nfoo \n foo`)
    })

    test.it('should log data with defined method', () => {
      homebridge.log('foo', 'debug')
      test.expect(domapic.stubs.plugin.tracer.debug).to.have.been.calledWith(`${PRE_LOG} foo`)
    })
  })

  test.describe('stop method', () => {
    test.it('should do nothing if there is no current process', () => {
      homebridge.process = null
      return homebridge.stop()
        .then(() => {
          return test.expect(treeKill.stub).to.not.have.been.called()
        })
    })

    test.it('should call to kill the process, and resolve the promise when it finish ok', () => {
      treeKill.utils.executeCallback(true, null)
      homebridge.process = true
      return homebridge.stop()
        .then(() => {
          return test.expect(treeKill.stub).to.have.been.called()
        })
    })

    test.it('should call to kill the process, and reject the promise when it finish with error', () => {
      const killError = new Error('foo error')
      treeKill.utils.executeCallback(true, killError)
      homebridge.process = true
      return homebridge.stop()
        .then(() => {
          return test.assert.fail()
        }, err => {
          return test.expect(err).to.equal(killError)
        })
    })
  })

  test.describe('restart method', () => {
    test.it('should call to stop homebridge, and then start it', () => {
      treeKill.utils.executeCallback(true, null)
      homebridge.process = true
      return homebridge.restart()
        .then(() => {
          return Promise.all([
            test.expect(treeKill.stub).to.have.been.called(),
            test.expect(childProcess.stubs.spawn).to.have.been.called()
          ])
        })
    })
  })
})
