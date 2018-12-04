const path = require('path')

const test = require('narval')

const DomapicMocks = require('./Domapic.mocks')

test.describe('server', () => {
  let domapic

  test.before(() => {
    domapic = new DomapicMocks()
    require('../../server')
  })

  test.after(() => {
    domapic.restore()
  })

  test.it('should have created a Domapic Plugin, passing the package path', () => {
    test.expect(domapic.stubs.createPlugin.getCall(0).args[0].packagePath).to.equal(path.resolve(__dirname, '..', '..'))
  })

  test.it('should have called to start the server', () => {
    test.expect(domapic.stubs.plugin.start).to.have.been.called()
  })
})
