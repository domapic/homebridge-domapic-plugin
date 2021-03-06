const test = require('narval')

const HomebridgeMocks = require('../../Homebridge.mocks')
const CharacteristicMethodsMocks = require('./common/CharacteristicMethods.mocks')
const NotificationsBridgeMocks = require('../../plugin/NotificationsBridge.mocks')

test.describe('ContactSensor Plugin Factory', () => {
  let homebridge
  let notificationsBridge
  let characteristicMethods
  let ContactSensorFactory
  let ContactSensor
  let contactSensorPlugin
  let fooConfig
  let sandbox
  let log

  test.beforeEach(() => {
    sandbox = test.sinon.createSandbox()
    log = sandbox.stub()
    fooConfig = {
      accessory: 'ContactSensor',
      name: 'ContactSensor Domapic',
      apiKey: 'foo-key',
      abilitiesBridgeUrl: 'http://foo-host:foo-port/api/controller/abilities/',
      characteristics: [
        {
          characteristic: 'ContactSensorState',
          get: {
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
    characteristicMethods = new CharacteristicMethodsMocks()
    notificationsBridge = new NotificationsBridgeMocks()

    ContactSensorFactory = require('../../../../lib/plugins/ContactSensorFactory')
    ContactSensor = new ContactSensorFactory(homebridge.stubs.hap.Service, homebridge.stubs.hap.Characteristic, notificationsBridge.stubs.instance)
    contactSensorPlugin = new ContactSensor(log, fooConfig)
  })

  test.afterEach(() => {
    sandbox.restore()
    homebridge.restore()
    characteristicMethods.restore()
    notificationsBridge.restore()
  })

  test.describe('ContactSensor static name getter', () => {
    test.it('should return accessory name', () => {
      test.expect(ContactSensor.name).to.equal('ContactSensor')
    })
  })

  test.describe('ContactSensor instance', () => {
    test.describe('logError method', () => {
      test.it('should log error message', () => {
        const FOO_MESSAGE = 'Foo error message'
        const error = new Error(FOO_MESSAGE)
        contactSensorPlugin.logError(error)
        test.expect(log).to.have.been.calledWith(`ERROR: ${FOO_MESSAGE}`)
      })
    })

    test.describe('getServices method', () => {
      test.it('should set accesory Manufacturer as Domapic', () => {
        contactSensorPlugin.getServices()
        test.expect(homebridge.instances.accessoryInformation.setCharacteristic).to.have.been.calledWith(
          homebridge.stubs.hap.Characteristic.Manufacturer,
          'Domapic'
        )
      })

      test.it('should set accesory Model with configuration servicePackageName', () => {
        contactSensorPlugin.getServices()
        test.expect(homebridge.instances.accessoryInformation.setCharacteristic).to.have.been.calledWith(
          homebridge.stubs.hap.Characteristic.Model,
          'foo-service-package'
        )
      })

      test.it('should set accesory SerialNumber with configuration serviceProcessId', () => {
        contactSensorPlugin.getServices()
        test.expect(homebridge.instances.accessoryInformation.setCharacteristic).to.have.been.calledWith(
          homebridge.stubs.hap.Characteristic.SerialNumber,
          'foo-service-processId'
        )
      })

      test.it('should update ContactSensorState value when receives a contactSensor notification', () => {
        contactSensorPlugin.getServices()
        const notificationCallBack = characteristicMethods.stubs.instance.emitter.on.getCall(0).args[1]
        notificationCallBack(true)
        test.expect(homebridge.instances.contactSensor.updateValue).to.have.been.calledWith(true)
      })

      test.it('should not update ContactSensorState value if no notifications are configured', () => {
        delete characteristicMethods.stubs.instance.emitter
        contactSensorPlugin = new ContactSensor(log, fooConfig)
        contactSensorPlugin.getServices()
        test.expect(characteristicMethods.stubs.instance.emitter).to.be.undefined()
      })
    })
  })
})
