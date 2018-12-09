const path = require('path')

const test = require('narval')

const DomapicMocks = require('../Domapic.mocks')
const FsExtraMocks = require('../FsExtra.mocks')
const IpMocks = require('../Ip.mocks')

test.describe('Homebridge Config', () => {
  const fooConfig = {
    homebridgePort: 3422,
    port: 'foo-port',
    hostName: '',
    name: 'foo-name'
  }
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
      },
      {
        _id: 'foo-id-3',
        _service: 'foo-service-id-3',
        name: 'foo-name-3',
        action: true,
        service: {
          _id: 'foo-service-id-3',
          name: 'foo-service-name-3',
          package: 'foo-service-package-3',
          processId: 'foo-service-processId-3'
        }
      }
    ]
    domapic = new DomapicMocks()
    fsExtra = new FsExtraMocks()
    ip = new IpMocks()
    HomebridgeConfig = require('../../../lib/HomebridgeConfig')

    domapic.stubs.plugin.config.get.resolves(fooConfig)

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
    const homebridgeConfigPath = path.resolve(__dirname, '..', '..', '..', 'homebridge')
    const homebridgeConfigFile = path.resolve(homebridgeConfigPath, 'config.json')
    test.it('should write abilities based configuration in homebridge folder', () => {
      return homebridgeConfig.write(fooAbilities)
        .then(() => {
          return test.expect(fsExtra.stubs.writeJson.getCall(0).args[0]).to.equal(homebridgeConfigFile)
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
            }, {
              abilityName: 'foo-name-3',
              accessory: 'DomapicStatelessSwitch',
              apiKey: 'foo-key',
              bridgeUrl: 'http://foo-host:foo-port/api/controller/abilities/foo-id-3',
              name: 'foo-service-name-3 foo-name-3',
              serviceName: 'foo-service-name-3',
              servicePackageName: 'foo-service-package-3',
              serviceProcessId: 'foo-service-processId-3'
            }])
        })
    })

    test.it('should ensure that homebridge folder exists', () => {
      return homebridgeConfig.write(fooAbilities)
        .then(() => {
          return test.expect(fsExtra.stubs.ensureDirSync.getCall(0).args[0]).to.equal(homebridgeConfigPath)
        })
    })

    test.it('should set port based on homebridgePort plugin configuration', () => {
      return homebridgeConfig.write(fooAbilities)
        .then(() => {
          return test.expect(fsExtra.stubs.writeJson.getCall(0).args[1].bridge.port).to.equal(fooConfig.homebridgePort)
        })
    })

    test.it('should set name based on plugin name', () => {
      return homebridgeConfig.write(fooAbilities)
        .then(() => {
          return test.expect(fsExtra.stubs.writeJson.getCall(0).args[1].bridge.name).to.equal(fooConfig.name)
        })
    })

    test.it('should set username based on previously stored mac', () => {
      const fooMac = 'foo-mac'
      domapic.stubs.plugin.storage.get.withArgs('username_mac').resolves(fooMac)
      return homebridgeConfig.write(fooAbilities)
        .then(() => {
          return test.expect(fsExtra.stubs.writeJson.getCall(0).args[1].bridge.username).to.equal(fooMac)
        })
    })

    test.it('should save a new mac if there is no one in storage', () => {
      domapic.stubs.plugin.storage.get.withArgs('username_mac').rejects(new Error())
      return homebridgeConfig.write(fooAbilities)
        .then(() => {
          return test.expect(domapic.stubs.plugin.storage.set.getCall(0).args[0]).to.equal('username_mac')
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
