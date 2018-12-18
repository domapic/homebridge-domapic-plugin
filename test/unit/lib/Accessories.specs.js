const test = require('narval')

const DomapicMocks = require('../Domapic.mocks')

test.describe.skip('Accesories', () => {
  let Abilities
  let abilities
  let domapic

  test.before(() => {
    domapic = new DomapicMocks()
    Abilities = require('../../../lib/Accessories')
  })

  test.after(() => {
    domapic.restore()
  })

  test.describe('get method', () => {
    test.beforeEach(() => {
      domapic.stubs.plugin.controller.abilities.get.resolves([])
      abilities = new Abilities(domapic.stubs.plugin)
    })

    test.it('should get abilities from controller', () => {
      return abilities.get()
        .then(() => {
          return test.expect(domapic.stubs.plugin.controller.abilities.get).to.have.been.called()
        })
    })

    test.it('should get services from controller', () => {
      return abilities.get()
        .then(() => {
          return test.expect(domapic.stubs.plugin.controller.services.get).to.have.been.called()
        })
    })

    test.it('should return all abilities, adding the correspondant service data to each one', () => {
      const fooAbilities = [
        {
          _id: 'foo-id',
          _service: 'foo-service-id'
        },
        {
          _id: 'foo-id-2',
          _service: 'foo-service-id-2'
        }
      ]
      const fooServices = [
        {
          _id: 'foo-service-id'
        },
        {
          _id: 'foo-service-id-2'
        }
      ]
      domapic.stubs.plugin.controller.abilities.get.resolves(fooAbilities)
      domapic.stubs.plugin.controller.services.get.resolves(fooServices)
      abilities = new Abilities(domapic.stubs.plugin)
      return abilities.get()
        .then(result => {
          return test.expect(result).to.deep.equal([
            {
              _id: 'foo-id',
              _service: 'foo-service-id',
              service: {
                _id: 'foo-service-id'
              }
            },
            {
              _id: 'foo-id-2',
              _service: 'foo-service-id-2',
              service: {
                _id: 'foo-service-id-2'
              }
            }
          ])
        })
    })
  })
})
