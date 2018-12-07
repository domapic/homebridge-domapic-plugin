const test = require('narval')

const HomebridgeMocks = require('../../Homebridge.mocks')
const RequestPromiseMocks = require('../../RequestPromise.mocks')

test.describe('Switch Plugin Factory', () => {
  let homebridge
  let requestPromise
  let SwitchFactory
  let Switch
  let switchPlugin
  let fooConfig
  let sandbox
  let log

  test.beforeEach(() => {
    sandbox = test.sinon.createSandbox()
    log = sandbox.stub()
    fooConfig = {
      abilityName: 'foo-name',
      accessory: 'DomapicSwitch',
      apiKey: 'foo-api-key',
      bridgeUrl: 'foo-url/foo-id',
      name: 'foo-service-name foo-name',
      serviceName: 'foo-service-name',
      servicePackageName: 'foo-service-package',
      serviceProcessId: 'foo-service-processId'
    }
    homebridge = new HomebridgeMocks()
    requestPromise = new RequestPromiseMocks()

    SwitchFactory = require('../../../../lib/plugins/SwitchFactory')
    Switch = new SwitchFactory(homebridge.stubs.hap.Service, homebridge.stubs.hap.Characteristic)
    switchPlugin = new Switch(log, fooConfig)
  })

  test.afterEach(() => {
    sandbox.restore()
    homebridge.restore()
    requestPromise.restore()
  })

  test.describe('Switch static name getter', () => {
    test.it('should return accessory name', () => {
      test.expect(Switch.name).to.equal('DomapicSwitch')
    })
  })

  test.describe('Switch instance', () => {
    test.describe('logError method', () => {
      test.it('should log error message', () => {
        const FOO_MESSAGE = 'Foo error message'
        const error = new Error(FOO_MESSAGE)
        switchPlugin.logError(error)
        test.expect(log).to.have.been.calledWith(`ERROR: ${FOO_MESSAGE}`)
      })
    })

    test.describe('getServices method', () => {
      test.it('should set accesory Manufacturer as Domapic', () => {
        switchPlugin.getServices()
        test.expect(homebridge.instances.accessoryInformation.setCharacteristic).to.have.been.calledWith(
          homebridge.stubs.hap.Characteristic.Manufacturer,
          'Domapic'
        )
      })

      test.it('should set accesory Model with configuration servicePackageName', () => {
        switchPlugin.getServices()
        test.expect(homebridge.instances.accessoryInformation.setCharacteristic).to.have.been.calledWith(
          homebridge.stubs.hap.Characteristic.Model,
          'foo-service-package'
        )
      })

      test.it('should set accesory SerialNumber with configuration serviceProcessId', () => {
        switchPlugin.getServices()
        test.expect(homebridge.instances.accessoryInformation.setCharacteristic).to.have.been.calledWith(
          homebridge.stubs.hap.Characteristic.SerialNumber,
          'foo-service-processId'
        )
      })

      test.it('should have configured switch service to call "getSwitchOnCharacteristic" method on get event', () => {
        switchPlugin.getServices()
        test.expect(homebridge.instances.switch.on).to.have.been.calledWith(
          'get',
          switchPlugin.getSwitchOnCharacteristic
        )
      })

      test.it('should have configured switch service to call "setSwitchOnCharacteristic" method on set event', () => {
        switchPlugin.getServices()
        test.expect(homebridge.instances.switch.on).to.have.been.calledWith(
          'set',
          switchPlugin.setSwitchOnCharacteristic
        )
      })
    })

    test.describe('getSwitchOnCharacteristic method', () => {
      test.it('should call to request plugin bridge api, and invoque callback with result if request is success', () => {
        const fooData = 'foo'
        requestPromise.stub.resolves({
          data: fooData
        })
        const cb = sandbox.stub()
        return switchPlugin.getSwitchOnCharacteristic(cb)
          .then(() => {
            return Promise.all([
              test.expect(requestPromise.stub).to.have.been.called(),
              test.expect(cb).to.have.been.calledWith(null, fooData)
            ])
          })
      })

      test.it('should invoque callback with error if request fails', () => {
        const fooError = new Error('foo')
        requestPromise.stub.rejects(fooError)
        const cb = sandbox.stub()
        return switchPlugin.getSwitchOnCharacteristic(cb)
          .then(() => {
            return test.expect(cb).to.have.been.calledWith(fooError)
          })
      })
    })

    test.describe('setSwitchOnCharacteristic method', () => {
      test.it('should call to request plugin bridge api, and invoque callback with no data if request is success', () => {
        const fooData = 'foo'
        requestPromise.stub.resolves()
        const cb = sandbox.stub()
        return switchPlugin.setSwitchOnCharacteristic(fooData, cb)
          .then(() => {
            return Promise.all([
              test.expect(requestPromise.stub.getCall(0).args[0].body.data).to.equal(fooData),
              test.expect(cb).to.have.been.called()
            ])
          })
      })

      test.it('should invoque callback with error if request fails', () => {
        const fooError = new Error('foo')
        requestPromise.stub.rejects(fooError)
        const cb = sandbox.stub()
        return switchPlugin.setSwitchOnCharacteristic('foo', cb)
          .then(() => {
            return test.expect(cb).to.have.been.calledWith(fooError)
          })
      })
    })
  })
})
