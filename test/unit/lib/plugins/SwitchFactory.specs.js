const test = require('narval')

const HomebridgeMocks = require('../../Homebridge.mocks')
const RequestPromiseMocks = require('../../RequestPromise.mocks')
const CharacteristicMethodsMocks = require('./common/CharacteristicMethods.mocks')
const NotificationsBridgeMocks = require('../../plugin/NotificationsBridge.mocks')

test.describe('Switch Plugin Factory', () => {
  let homebridge
  let notificationsBridge
  let requestPromise
  let characteristicMethods
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
      accessory: 'Switch',
      name: 'Switch Domapic',
      apiKey: 'foo-key',
      abilitiesBridgeUrl: 'http://foo-host:foo-port/api/controller/abilities/',
      characteristics: [
        {
          characteristic: 'On',
          get: {
            ability: 'ability-id',
            dataType: 'boolean'
          },
          set: {
            ability: 'ability-id',
            dataType: 'boolean'
          },
          notify: {
            ability: 'ability-id',
            dataType: 'boolean'
          }
        }
      ],
      serviceName: 'foo-service-name',
      serviceVersion: '1.0.0',
      servicePackageName: 'foo-service-package',
      serviceProcessId: 'foo-service-processId'
    }
    homebridge = new HomebridgeMocks()
    notificationsBridge = new NotificationsBridgeMocks()
    requestPromise = new RequestPromiseMocks()
    characteristicMethods = new CharacteristicMethodsMocks()

    SwitchFactory = require('../../../../lib/plugins/SwitchFactory')
    Switch = new SwitchFactory(homebridge.stubs.hap.Service, homebridge.stubs.hap.Characteristic, notificationsBridge.stubs.instance)
    switchPlugin = new Switch(log, fooConfig)
  })

  test.afterEach(() => {
    sandbox.restore()
    homebridge.restore()
    requestPromise.restore()
    characteristicMethods.restore()
    notificationsBridge.restore()
  })

  test.describe('Switch static name getter', () => {
    test.it('should return accessory name', () => {
      test.expect(Switch.name).to.equal('Switch')
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

      test.it('should update ContactSensorState value when receives a contactSensor notification', () => {
        switchPlugin.getServices()
        const notificationCallBack = characteristicMethods.stubs.instance.emitter.on.getCall(0).args[1]
        notificationCallBack(true)
        test.expect(homebridge.instances.switch.updateValue).to.have.been.calledWith(true)
      })

      test.it('should not update ContactSensorState value if no notifications are configured', () => {
        delete characteristicMethods.stubs.instance.emitter
        switchPlugin = new Switch(log, fooConfig)
        switchPlugin.getServices()
        test.expect(characteristicMethods.stubs.instance.emitter).to.be.undefined()
      })
    })
  })
})
