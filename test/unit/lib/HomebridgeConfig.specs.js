const path = require('path')

const test = require('narval')

const DomapicMocks = require('../Domapic.mocks')
const FsExtraMocks = require('../FsExtra.mocks')
const IpMocks = require('../Ip.mocks')

test.describe('Homebridge Config', () => {
  let HomebridgeConfig
  let homebridgeConfig
  let ip
  let fsExtra
  let domapic
  let fooAbilities

  test.beforeEach(() => {
    fooAbilities = [
      {
        _id: 'foo-id',
        _service: 'foo-service-id',
        name: 'foo-name',
        type: 'boolean',
        action: true,
        state: true,
        service: {
          _id: 'foo-service-id',
          name: 'foo-service-name',
          package: 'foo-service-package',
          processId: 'foo-service-processId'
        }
      },
      {
        _id: 'foo-id-2',
        _service: 'foo-service-id-2',
        type: 'boolean',
        action: false,
        state: true,
        service: {
          _id: 'foo-service-id-2'
        }
      }
    ]
    domapic = new DomapicMocks()
    fsExtra = new FsExtraMocks()
    ip = new IpMocks()
    HomebridgeConfig = require('../../../lib/HomebridgeConfig')

    domapic.stubs.plugin.config.get.resolves({
      port: 'foo-port',
      hostName: ''
    })

    ip.stubs.address.returns('foo-host')

    domapic.stubs.plugin.storage.get.resolves([
      {
        key: 'foo-key',
        role: 'admin'
      }
    ])
    homebridgeConfig = new HomebridgeConfig(domapic.stubs.plugin)
  })

  test.afterEach(() => {
    ip.restore()
    domapic.restore()
    fsExtra.restore()
  })

  test.describe('write method', () => {
    const homebridgeConfigPath = path.resolve(__dirname, '..', '..', '..', '.homebridge', 'config.json')
    test.it('should write abilities based configuration in homebridge folder', () => {
      return homebridgeConfig.write(fooAbilities)
        .then(() => {
          return test.expect(fsExtra.stubs.writeJson.getCall(0).args[0]).to.equal(homebridgeConfigPath)
        })
    })

    test.it('should write accesories based in provided abilities', () => {
      return homebridgeConfig.write(fooAbilities)
        .then(() => {
          return test.expect(fsExtra.stubs.writeJson.getCall(0).args[1].accessories).to.deep.equal(
            [{
              abilityName: 'foo-name',
              accessory: 'DomapicSwitch',
              apiKey: 'foo-key',
              bridgeUrl: 'http://foo-host:foo-port/api/controller/abilities/foo-id',
              name: 'foo-service-name foo-name',
              serviceName: 'foo-service-name',
              servicePackageName: 'foo-service-package',
              serviceProcessId: 'foo-service-processId'
            }])
        })
    })

    test.it('should set port based on homebridgePort plugin configuration', () => {
      const fooPort = 3422
      domapic.stubs.plugin.config.get.withArgs('homebridgePort').resolves(fooPort)
      return homebridgeConfig.write(fooAbilities)
        .then(() => {
          return test.expect(fsExtra.stubs.writeJson.getCall(0).args[1].bridge.port).to.equal(fooPort)
        })
    })
  })

  test.describe('getSwitchs method', () => {
    test.it('should return all abilities having boolean type, state and action', () => {
      const fooPluginConnection = {
        url: 'foo-url/',
        apiKey: 'foo-api-key'
      }
      fooAbilities = [
        {
          _id: 'foo-id',
          _service: 'foo-service-id',
          name: 'foo-name',
          type: 'boolean',
          action: true,
          state: true,
          service: {
            _id: 'foo-service-id',
            name: 'foo-service-name',
            package: 'foo-service-package',
            processId: 'foo-service-processId'
          }
        },
        {
          _id: 'foo-id-2',
          _service: 'foo-service-id-2',
          type: 'boolean',
          action: false,
          state: true,
          service: {
            _id: 'foo-service-id-2'
          }
        },
        {
          _id: 'foo-id-2',
          _service: 'foo-service-id-2',
          name: 'foo-name-2',
          type: 'boolean',
          action: true,
          state: true,
          service: {
            _id: 'foo-service-id-2',
            name: 'foo-service-name-2',
            package: 'foo-service-package-2',
            processId: 'foo-service-processId-2'
          }
        }
      ]
      test.expect(homebridgeConfig.getSwitchs(fooAbilities, fooPluginConnection)).to.deep.equal([{
        abilityName: 'foo-name',
        accessory: 'DomapicSwitch',
        apiKey: 'foo-api-key',
        bridgeUrl: 'foo-url/foo-id',
        name: 'foo-service-name foo-name',
        serviceName: 'foo-service-name',
        servicePackageName: 'foo-service-package',
        serviceProcessId: 'foo-service-processId'
      }, {
        abilityName: 'foo-name-2',
        accessory: 'DomapicSwitch',
        apiKey: 'foo-api-key',
        bridgeUrl: 'foo-url/foo-id-2',
        name: 'foo-service-name-2 foo-name-2',
        serviceName: 'foo-service-name-2',
        servicePackageName: 'foo-service-package-2',
        serviceProcessId: 'foo-service-processId-2'
      }])
    })
  })

  test.describe('getPluginConnection method', () => {
    test.it('should return https url if sslCert configuration is found', () => {
      ip.stubs.address.returns('foo-ip')
      domapic.stubs.plugin.config.get.resolves({
        port: 'foo-port',
        hostName: '',
        sslCert: true
      })
      return homebridgeConfig.getPluginConnection()
        .then(result => {
          return test.expect(result.url).to.equal('https://foo-ip:foo-port/api/controller/abilities/')
        })
    })

    test.it('should return url with hostname if it is configured', () => {
      ip.stubs.address.returns('foo-ip')
      domapic.stubs.plugin.config.get.resolves({
        port: 'foo-port',
        hostName: 'foo-host',
        sslCert: true
      })
      return homebridgeConfig.getPluginConnection()
        .then(result => {
          return test.expect(result.url).to.equal('https://foo-host:foo-port/api/controller/abilities/')
        })
    })
  })
})
