const test = require('narval')

const DomapicMocks = require('../Domapic.mocks')

test.describe('Accesories', () => {
  let Accessories
  let accessories
  let domapic

  test.before(() => {
    domapic = new DomapicMocks()
    Accessories = require('../../../lib/Accessories')
  })

  test.after(() => {
    domapic.restore()
  })

  test.describe('get method', () => {
    test.beforeEach(() => {
      domapic.stubs.plugin.controller.services.get.resolves([])
      domapic.stubs.plugin.controller.abilities.get.resolves([])
      accessories = new Accessories(domapic.stubs.plugin)
    })

    test.it('should get abilities from controller', () => {
      return accessories.get()
        .then(() => {
          return test.expect(domapic.stubs.plugin.controller.abilities.get).to.have.been.called()
        })
    })

    test.it('should get services from controller', () => {
      return accessories.get()
        .then(() => {
          return test.expect(domapic.stubs.plugin.controller.services.get).to.have.been.called()
        })
    })

    test.describe('when plugin configuration exists for a service in the controller', () => {
      const fooAbilities = [
        {
          _id: 'foo-id',
          name: 'switch',
          _service: 'foo-service-id'
        }
      ]
      const fooServices = [
        {
          _id: 'foo-service-id',
          name: 'Foo Service'
        }
      ]
      let fooConfig = [{
        pluginPackageName: 'homebridge-domapic-plugin',
        config: {
          accessories: [
            {
              accessory: 'Switch',
              name: 'Foo Switch',
              characteristics: [
                {
                  characteristic: 'On',
                  get: {
                    ability: 'switch'
                  },
                  set: {
                    ability: 'switch'
                  }
                }
              ]
            },
            {
              accessory: 'Switch',
              characteristics: [
                {
                  characteristic: 'On',
                  get: {
                    fixture: true
                  },
                  set: {
                    ability: 'switch'
                  }
                }
              ]
            },
            {
              accessory: 'Switch',
              name: 'Foo Switch 2',
              characteristics: [
                {
                  characteristic: 'On',
                  set: {
                    ability: 'switch'
                  }
                }
              ]
            },
            {
              accessory: 'Switch',
              characteristics: [
              ]
            }
          ]
        }
      }]

      test.beforeEach(() => {
        domapic.stubs.plugin.controller.abilities.get.resolves(fooAbilities)
        domapic.stubs.plugin.controller.services.get.resolves(fooServices)
      })

      test.it('should return accessories based on existing configuration', () => {
        domapic.stubs.plugin.controller.servicePluginConfigs.get.resolves(fooConfig)
        return accessories.get()
          .then(result => {
            return test.expect(result).to.deep.equal([
              {
                accessory: 'Switch',
                characteristics: [
                  {
                    characteristic: 'On',
                    get: {
                      ability: 'foo-id',
                      dataType: undefined
                    },
                    set: {
                      ability: 'foo-id',
                      dataType: undefined
                    }
                  }
                ],
                name: 'Foo Service Foo Switch',
                service: {
                  _id: 'foo-service-id',
                  name: 'Foo Service'
                }
              },
              {
                accessory: 'Switch',
                characteristics: [
                  {
                    characteristic: 'On',
                    get: {
                      fixture: true
                    },
                    set: {
                      ability: 'foo-id',
                      dataType: undefined
                    }
                  }
                ],
                name: 'Foo Service Switch',
                service: {
                  _id: 'foo-service-id',
                  name: 'Foo Service'
                }
              },
              {
                accessory: 'Switch',
                characteristics: [
                  {
                    characteristic: 'On',
                    get: null,
                    set: {
                      ability: 'foo-id',
                      dataType: undefined
                    }
                  }
                ],
                name: 'Foo Service Foo Switch 2',
                service: {
                  _id: 'foo-service-id',
                  name: 'Foo Service'
                }
              }
            ])
          })
      })

      test.it('should omit accessories with wrong configuration', () => {
        fooConfig = [{
          pluginPackageName: 'homebridge-domapic-plugin',
          config: {
            accessories: [
              {
                accessory: 'Switch',
                name: 'Foo Switch',
                csha_racteristics: [
                  {
                    characteristic: 'On',
                    get: {
                      ability: 'switch'
                    },
                    set: {
                      ability: 'switch'
                    }
                  }
                ]
              }
            ]
          }
        }]
        domapic.stubs.plugin.controller.servicePluginConfigs.get.resolves(fooConfig)
        return accessories.get()
          .then(result => {
            return test.expect(result).to.deep.equal([])
          })
      })
    })

    test.describe('when plugin configuration does not exist for a service in the controller', () => {
      let fooAbilities = []
      const fooServices = [
        {
          _id: 'foo-service-id',
          name: 'Foo Service'
        }
      ]

      test.beforeEach(() => {
        domapic.stubs.plugin.controller.services.get.resolves(fooServices)
        domapic.stubs.plugin.controller.servicePluginConfigs.get.resolves([])
      })

      test.it('should create default configuration for abilities with action, state, and boolean data type', () => {
        fooAbilities = [{
          _id: 'foo-id',
          name: 'switch',
          _service: 'foo-service-id',
          type: 'boolean',
          action: true,
          state: true
        }]
        domapic.stubs.plugin.controller.abilities.get.resolves(fooAbilities)
        return accessories.get()
          .then(result => {
            return test.expect(result).to.deep.equal([
              {
                accessory: 'Switch',
                characteristics: [
                  {
                    characteristic: 'On',
                    get: {
                      ability: 'foo-id',
                      dataType: 'boolean'
                    },
                    set: {
                      ability: 'foo-id',
                      dataType: 'boolean'
                    }
                  }
                ],
                name: 'Foo Service Foo Service switch',
                service: {
                  _id: 'foo-service-id',
                  name: 'Foo Service'
                }
              }
            ])
          })
      })

      test.it('should create default configuration for abilities with action, and no data type', () => {
        fooAbilities = [{
          _id: 'foo-id',
          name: 'switch',
          _service: 'foo-service-id',
          action: true
        }]
        domapic.stubs.plugin.controller.abilities.get.resolves(fooAbilities)
        return accessories.get()
          .then(result => {
            return test.expect(result).to.deep.equal([
              {
                accessory: 'Switch',
                characteristics: [
                  {
                    characteristic: 'On',
                    get: {
                      fixture: false
                    },
                    set: {
                      ability: 'foo-id',
                      dataType: undefined
                    }
                  }
                ],
                name: 'Foo Service Foo Service switch',
                service: {
                  _id: 'foo-service-id',
                  name: 'Foo Service'
                }
              }
            ])
          })
      })

      test.it('should call to create default configuration in controller', () => {
        fooAbilities = [{
          _id: 'foo-id',
          name: 'switch',
          _service: 'foo-service-id',
          type: 'number',
          action: true,
          state: true
        }]
        domapic.stubs.plugin.controller.abilities.get.resolves(fooAbilities)
        return accessories.get()
          .then(result => {
            return test.expect(domapic.stubs.plugin.controller.servicePluginConfigs.create).to.have.been.calledWith({
              pluginPackageName: 'homebridge-domapic-plugin',
              _service: 'foo-service-id',
              config: {
                accessories: []
              }
            })
          })
      })
    })
  })
})
