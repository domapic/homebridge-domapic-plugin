const test = require('narval')

const SwitchFactoryMocks = require('../lib/plugins/SwitchFactory.mocks')
const ContactSensorFactoryMocks = require('../lib/plugins/ContactSensorFactory.mocks')
const HomebridgeMocks = require('../Homebridge.mocks')

test.describe('plugin', () => {
  let sandbox
  let switchFactory
  let contactSensorFactory
  let homebridge
  let plugin

  test.before(() => {
    sandbox = test.sinon.createSandbox()
    homebridge = new HomebridgeMocks()
    switchFactory = new SwitchFactoryMocks()
    contactSensorFactory = new ContactSensorFactoryMocks()
    plugin = require('../../../plugin/index')
    plugin(homebridge.stubs)
  })

  test.after(() => {
    sandbox.restore()
    switchFactory.restore()
    contactSensorFactory.restore()
  })

  test.it('should create a new Switch accessory', () => {
    test.expect(switchFactory.stubs.Constructor).to.have.been.calledWith(homebridge.stubs.hap.Service, homebridge.stubs.hap.Characteristic)
  })

  test.it('should register switch accesory in homebridge', () => {
    test.expect(homebridge.stubs.registerAccessory.getCall(0).args[2]).to.equal(switchFactory.stubs.instance)
  })

  test.it('should create a new ContactSensor accessory', () => {
    test.expect(contactSensorFactory.stubs.Constructor).to.have.been.calledWith(homebridge.stubs.hap.Service, homebridge.stubs.hap.Characteristic)
  })

  test.it('should register contactSensor accesory in homebridge', () => {
    test.expect(homebridge.stubs.registerAccessory.getCall(1).args[2]).to.equal(contactSensorFactory.stubs.instance)
  })
})
