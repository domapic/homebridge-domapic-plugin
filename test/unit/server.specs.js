const path = require('path')

const test = require('narval')

const LodashMocks = require('./Lodash.mocks')
const DomapicMocks = require('./Domapic.mocks')
const AccessoriesMocks = require('./lib/Accessories.mocks')
const AbilitiesBridgeMocks = require('./lib/api/AbilitiesBridge.mocks')
const HomebridgeMocks = require('./lib/Homebridge.mocks')
const HomebridgeConfigMocks = require('./lib/HomebridgeConfig.mocks')

test.describe('server', () => {
  const fooOperations = 'foo operations'
  const fooAccessories = 'foo abilities'
  let lodash
  let domapic
  let accessories
  let abilitiesBridgeMocks
  let homebridge
  let homebridgeConfig

  test.before(() => {
    lodash = new LodashMocks()
    domapic = new DomapicMocks()
    accessories = new AccessoriesMocks()
    abilitiesBridgeMocks = new AbilitiesBridgeMocks()
    homebridge = new HomebridgeMocks()
    homebridgeConfig = new HomebridgeConfigMocks()

    accessories.stubs.instance.get.resolves(fooAccessories)
    abilitiesBridgeMocks.stubs.instance.operations.returns(fooOperations)

    require('../../server')
  })

  test.after(() => {
    lodash.restore()
    domapic.restore()
    accessories.restore()
    abilitiesBridgeMocks.restore()
    homebridge.restore()
    homebridgeConfig.restore()
  })

  test.it('should have created a Domapic Plugin, passing the package path', () => {
    test.expect(domapic.stubs.createPlugin.getCall(0).args[0].packagePath).to.equal(path.resolve(__dirname, '..', '..'))
  })

  test.describe('when plugin is created', () => {
    test.before(() => {
      return domapic.utils.startHasBeenCalled()
    })

    test.it('should add listeners to restart homebridge when abilities are added, updated or deleted, or service is updated', () => {
      return Promise.all([
        test.expect(domapic.stubs.plugin.events.on.getCall(0).args[0]).to.equal('service:updated'),
        test.expect(domapic.stubs.plugin.events.on.getCall(1).args[0]).to.equal('service:created'),
        test.expect(domapic.stubs.plugin.events.on.getCall(2).args[0]).to.equal('service:deleted'),
        test.expect(domapic.stubs.plugin.events.on.getCall(3).args[0]).to.equal('servicePluginConfig:created'),
        test.expect(domapic.stubs.plugin.events.on.getCall(4).args[0]).to.equal('servicePluginConfig:updated'),
        test.expect(domapic.stubs.plugin.events.on.getCall(5).args[0]).to.equal('servicePluginConfig:deleted'),
        test.expect(domapic.stubs.plugin.events.on.getCall(6).args[0]).to.equal('ability:updated'),
        test.expect(domapic.stubs.plugin.events.on.getCall(7).args[0]).to.equal('ability:created'),
        test.expect(domapic.stubs.plugin.events.on.getCall(8).args[0]).to.equal('ability:deleted')
      ])
    })

    test.it('should add a listener to restart homebridge when controller connection success', () => {
      return test.expect(domapic.stubs.plugin.events.once.getCall(0).args[0]).to.equal('connection')
    })

    test.it('should extend plugin api with own abilities bridge api', () => {
      return Promise.all([
        test.expect(domapic.stubs.plugin.api.extendOpenApi).to.have.been.called(),
        test.expect(domapic.stubs.plugin.api.addOperations).to.have.been.calledWith(fooOperations)
      ])
    })

    test.describe('when restarting homebridge', () => {
      test.before(async () => {
        await lodash.utils.getDebounceCallback()()
      })

      test.it('should get accessories from controller', () => {
        test.expect(accessories.stubs.instance.get).to.have.been.called()
      })

      test.it('should write homebridge configuration based in controller accessories', () => {
        test.expect(homebridgeConfig.stubs.instance.write).to.have.been.calledWith(fooAccessories)
      })

      test.it('should restart homebridge', () => {
        test.expect(homebridge.stubs.instance.restart).to.have.been.called()
      })
    })
  })
})
