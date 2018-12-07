const test = require('narval')

const DomapicMocks = require('../../Domapic.mocks')

test.describe('Abilities bridge api', () => {
  const FOO_ABILITY_ID = 'foo-ability-id'
  let domapic
  let AbilitiesBridge
  let abilitiesBridge

  test.beforeEach(() => {
    domapic = new DomapicMocks()
    AbilitiesBridge = require('../../../../lib/api/AbilitiesBridge')
    abilitiesBridge = new AbilitiesBridge(domapic.stubs.plugin)
  })

  test.afterEach(() => {
    domapic.restore()
  })

  test.describe('action operation handler', () => {
    test.it('should call to controller ability action with provided ability id and received data', () => {
      return abilitiesBridge.operations().abilityActionHandler.handler({
        path: {
          id: FOO_ABILITY_ID
        }
      }, {
        data: true
      }).then(() => {
        return test.expect(domapic.stubs.plugin.controller.abilities.action).to.have.been.calledWith(FOO_ABILITY_ID, {
          data: true
        })
      })
    })
  })

  test.describe('state operation handler', () => {
    test.it('should call to controller ability state with provided ability id', () => {
      const FOO_ABILITY_ID = 'foo-ability-id'
      return abilitiesBridge.operations().abilityStateHandler.handler({
        path: {
          id: FOO_ABILITY_ID
        }
      }).then(() => {
        return test.expect(domapic.stubs.plugin.controller.abilities.state).to.have.been.calledWith(FOO_ABILITY_ID)
      })
    })
  })
})
