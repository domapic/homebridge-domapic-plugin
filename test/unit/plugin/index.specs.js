const test = require('narval')

const SwitchFactoryMocks = require('../lib/plugins/SwitchFactory.mocks')
const ButtonFactoryMocks = require('../lib/plugins/ButtonFactory.mocks')
const HomebridgeMocks = require('../Homebridge.mocks')

test.describe('plugin', () => {
  let sandbox
  let switchFactory
  let buttonFactory
  let homebridge
  let plugin

  test.before(() => {
    sandbox = test.sinon.createSandbox()
    homebridge = new HomebridgeMocks()
    switchFactory = new SwitchFactoryMocks()
    buttonFactory = new ButtonFactoryMocks()
    plugin = require('../../../plugin/index')
    plugin(homebridge.stubs)
  })

  test.after(() => {
    sandbox.restore()
    switchFactory.restore()
    buttonFactory.restore()
  })

  test.it('should create a new Switch accessory', () => {
    test.expect(switchFactory.stubs.Constructor).to.have.been.calledWith(homebridge.stubs.hap.Service, homebridge.stubs.hap.Characteristic)
  })

  test.it('should register switch accesory in homebridge', () => {
    test.expect(homebridge.stubs.registerAccessory.getCall(0).args[2]).to.equal(switchFactory.stubs.instance)
  })

  test.it('should create a new Button accessory', () => {
    test.expect(buttonFactory.stubs.Constructor).to.have.been.calledWith(homebridge.stubs.hap.Service, homebridge.stubs.hap.Characteristic)
  })

  test.it('should register button accesory in homebridge', () => {
    test.expect(homebridge.stubs.registerAccessory.getCall(1).args[2]).to.equal(buttonFactory.stubs.instance)
  })
})
