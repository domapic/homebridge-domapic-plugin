const test = require('narval')

const RequestPromiseMocks = require('../../../RequestPromise.mocks')

test.describe('Characteristic Methods', () => {
  const fooUrl = 'foo-url'
  const fooRequestOptions = {}
  let requestPromise
  let sandbox
  let CharacteristicMethods
  let characteristicMethods
  let fooBindScope
  let log
  let logError

  test.beforeEach(() => {
    sandbox = test.sinon.createSandbox()
    log = sandbox.stub()
    logError = sandbox.stub()
    requestPromise = new RequestPromiseMocks()
    fooBindScope = {
      requestOptions: fooRequestOptions,
      log,
      logError
    }

    CharacteristicMethods = require('../../../../../lib/plugins/common/CharacteristicMethods')
  })

  test.afterEach(() => {
    sandbox.restore()
    requestPromise.restore()
  })

  test.describe('get method', () => {
    test.it('should have configured get to call a fixture if no ability is defined for get', () => {
      characteristicMethods = new CharacteristicMethods({
        characteristic: 'On',
        get: {
          fixture: false,
          dataType: 'boolean'
        },
        set: {
          ability: 'ability-id',
          dataType: 'boolean'
        }
      }, fooUrl)

      characteristicMethods.get = characteristicMethods.get.bind(fooBindScope)
      const cb = sandbox.stub()
      return characteristicMethods.get(cb)
        .then(() => {
          return Promise.all([
            test.expect(requestPromise.stub).to.not.have.been.called(),
            test.expect(cb).to.have.been.calledWith(null, false)
          ])
        })
    })

    test.it('should have configured get to call bridge if ability is defined for get', () => {
      characteristicMethods = new CharacteristicMethods({
        characteristic: 'ContactSensorState',
        get: {
          ability: 'ability-id',
          dataType: 'boolean'
        },
        set: {
          ability: 'ability-id',
          dataType: 'boolean'
        }
      }, fooUrl)

      characteristicMethods.get = characteristicMethods.get.bind(fooBindScope)
      const fooData = 'foo'
      requestPromise.stub.resolves({
        data: fooData
      })
      const cb = sandbox.stub()
      return characteristicMethods.get(cb)
        .then(() => {
          return Promise.all([
            test.expect(requestPromise.stub).to.have.been.called(),
            test.expect(cb).to.have.been.calledWith(null, fooData)
          ])
        })
    })

    test.it('should invoque callback with error if request fails when calling to bridge', () => {
      characteristicMethods = new CharacteristicMethods({
        characteristic: 'ContactSensorState',
        get: {
          ability: 'ability-id',
          dataType: 'boolean'
        },
        set: {
          ability: 'ability-id',
          dataType: 'boolean'
        }
      }, fooUrl)

      characteristicMethods.get = characteristicMethods.get.bind(fooBindScope)
      const fooError = new Error('foo')
      requestPromise.stub.rejects(fooError)
      const cb = sandbox.stub()
      return characteristicMethods.get(cb)
        .then(() => {
          return test.expect(cb).to.have.been.calledWith(fooError)
        })
    })

    test.describe('set method', () => {
      test.it('should have configured set to do nothing if no ability is defined for set', () => {
        characteristicMethods = new CharacteristicMethods({
          characteristic: 'On',
          get: {
            ability: 'ability-id',
            dataType: 'boolean'
          },
          set: {
          }
        }, fooUrl)

        characteristicMethods.set = characteristicMethods.set.bind(fooBindScope)
        const cb = sandbox.stub()
        return characteristicMethods.set(false, cb)
          .then(() => {
            return Promise.all([
              test.expect(requestPromise.stub).to.not.have.been.called(),
              test.expect(cb).to.have.been.called(),
              test.expect(cb.getCall(0).args[0]).to.be.undefined()
            ])
          })
      })

      test.it('should have configured set to call bridge if ability is defined for set', () => {
        characteristicMethods = new CharacteristicMethods({
          characteristic: 'On',
          get: {
            ability: 'ability-id',
            dataType: 'boolean'
          },
          set: {
            ability: 'ability-id',
            dataType: 'boolean'
          }
        }, fooUrl)

        characteristicMethods.set = characteristicMethods.set.bind(fooBindScope)
        const fooData = 'foo'
        requestPromise.stub.resolves()
        const cb = sandbox.stub()
        return characteristicMethods.set(fooData, cb)
          .then(() => {
            return Promise.all([
              test.expect(requestPromise.stub.getCall(0).args[0].body.data).to.equal(fooData),
              test.expect(cb).to.have.been.called()
            ])
          })
      })

      test.it('should call to bridge api with no data if ability has no dataType', () => {
        characteristicMethods = new CharacteristicMethods({
          characteristic: 'On',
          get: {
            ability: 'ability-id',
            dataType: 'boolean'
          },
          set: {
            ability: 'ability-id'
          }
        }, fooUrl)

        characteristicMethods.set = characteristicMethods.set.bind(fooBindScope)
        const fooData = 'foo'
        requestPromise.stub.resolves()
        const cb = sandbox.stub()
        return characteristicMethods.set(fooData, cb)
          .then(() => {
            return Promise.all([
              test.expect(requestPromise.stub.getCall(0).args[0].body).to.be.undefined(),
              test.expect(cb).to.have.been.called()
            ])
          })
      })

      test.it('should invoque callback with error if request fails when calling to bridge', () => {
        characteristicMethods = new CharacteristicMethods({
          characteristic: 'On',
          get: {
            ability: 'ability-id',
            dataType: 'boolean'
          },
          set: {
            ability: 'ability-id'
          }
        }, fooUrl)

        characteristicMethods.set = characteristicMethods.set.bind(fooBindScope)
        const fooError = new Error('foo')
        requestPromise.stub.rejects(fooError)
        const cb = sandbox.stub()
        return characteristicMethods.set('foo', cb)
          .then(() => {
            return test.expect(cb).to.have.been.calledWith(fooError)
          })
      })
    })
  })
})
