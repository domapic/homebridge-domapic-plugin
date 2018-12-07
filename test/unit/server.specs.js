const path = require('path')

const test = require('narval')

const LodashMocks = require('./Lodash.mocks')
const DomapicMocks = require('./Domapic.mocks')
const AbilitiesMocks = require('./lib/Abilities.mocks')
const AbilitiesBridgeMocks = require('./lib/api/AbilitiesBridge.mocks')
const HomebridgeMocks = require('./lib/Homebridge.mocks')
const HomebridgeConfigMocks = require('./lib/HomebridgeConfig.mocks')

test.describe('server', () => {
  const fooOperations = 'foo operations'
  const fooAbilities = 'foo abilities'
  let lodash
  let domapic
  let abilities
  let abilitiesBridgeMocks
  let homebridge
  let homebridgeConfig

  test.before(() => {
    lodash = new LodashMocks()
    domapic = new DomapicMocks()
    abilities = new AbilitiesMocks()
    abilitiesBridgeMocks = new AbilitiesBridgeMocks()
    homebridge = new HomebridgeMocks()
    homebridgeConfig = new HomebridgeConfigMocks()

    abilities.stubs.instance.get.resolves(fooAbilities)
    abilitiesBridgeMocks.stubs.instance.operations.returns(fooOperations)

    require('../../server')
  })

  test.after(() => {
    lodash.restore()
    domapic.restore()
    abilities.restore()
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
        test.expect(domapic.stubs.plugin.events.on.getCall(0).args[0]).to.equal('ability:updated'),
        test.expect(domapic.stubs.plugin.events.on.getCall(1).args[0]).to.equal('ability:created'),
        test.expect(domapic.stubs.plugin.events.on.getCall(2).args[0]).to.equal('ability:deleted'),
        test.expect(domapic.stubs.plugin.events.on.getCall(3).args[0]).to.equal('service:updated')
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

      test.it('should get abilities from controller', () => {
        test.expect(abilities.stubs.instance.get).to.have.been.called()
      })

      test.it('should write homebridge configuration based in controller abilities', () => {
        test.expect(homebridgeConfig.stubs.instance.write).to.have.been.calledWith(fooAbilities)
      })

      test.it('should restart homebridge', () => {
        test.expect(homebridge.stubs.instance.restart).to.have.been.called()
      })
    })
  })
})
