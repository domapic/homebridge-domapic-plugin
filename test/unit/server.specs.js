const path = require('path')

const test = require('narval')

const DomapicMocks = require('./Domapic.mocks')
const HomebridgeMocks = require('./lib/Homebridge.mocks')

test.describe('server', () => {
  let domapic
  let homebridge

  test.before(() => {
    domapic = new DomapicMocks()
    homebridge = new HomebridgeMocks()
    require('../../server')
  })

  test.after(() => {
    domapic.restore()
    homebridge.restore()
  })

  test.it('should have created a Domapic Plugin, passing the package path', () => {
    test.expect(domapic.stubs.createPlugin.getCall(0).args[0].packagePath).to.equal(path.resolve(__dirname, '..', '..'))
  })
})
