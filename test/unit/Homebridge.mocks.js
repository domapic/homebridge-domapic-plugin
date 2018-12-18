const test = require('narval')

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const stubs = {
    hap: {
      Service: sandbox.stub(),
      Characteristic: sandbox.stub()
    },
    registerAccessory: sandbox.stub()
  }

  const instances = {
    accessoryInformation: {
      setCharacteristic: sandbox.stub().callsFake(() => {
        return instances.accessoryInformation
      })
    },
    switch: {
      on: sandbox.stub().callsFake(() => {
        return instances.switch
      }),
      getCharacteristic: sandbox.stub().callsFake(() => {
        return instances.switch
      })
    },
    contactSensor: {
      on: sandbox.stub().callsFake(() => {
        return instances.switch
      }),
      getCharacteristic: sandbox.stub().callsFake(() => {
        return instances.switch
      })
    }
  }

  stubs.hap.Characteristic.Model = 'MODEL'
  stubs.hap.Characteristic.SerialNumber = 'SERIAL_NUMBER'
  stubs.hap.Characteristic.Manufacturer = 'MANUFACTURER'
  stubs.hap.Characteristic.On = 'ON'

  stubs.hap.Service.AccessoryInformation = sandbox.stub().callsFake(function () {
    return instances.accessoryInformation
  })

  stubs.hap.Service.Switch = sandbox.stub().callsFake(function () {
    return instances.switch
  })

  stubs.hap.Service.ContactSensor = sandbox.stub().callsFake(function () {
    return instances.contactSensor
  })

  const restore = () => {
    sandbox.restore()
  }

  return {
    restore,
    stubs,
    instances
  }
}

module.exports = Mock
