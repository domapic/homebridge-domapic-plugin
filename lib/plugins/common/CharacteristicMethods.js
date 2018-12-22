'use strict'

const requestPromise = require('request-promise')

const GetBridge = function (bridgeUrl) {
  return function (next) {
    this.log(`Getting state`)
    return requestPromise({
      ...this.requestOptions,
      uri: bridgeUrl
    }).then(body => {
      this.log(`State is "${body.data}"`)
      next(null, body.data)
    }).catch(error => {
      this.logError(error)
      next(error)
    })
  }
}

const GetFixture = function (fixture) {
  return function (next) {
    this.log(`Getting fixture state. Returning fixed value`)
    next(null, fixture)
    return Promise.resolve()
  }
}

const SetBridge = function (bridgeUrl, abilityDataType) {
  return function (on, next) {
    this.log(`Setting to "${on}"`)
    const body = abilityDataType ? { data: on } : undefined
    return requestPromise({
      ...this.requestOptions,
      uri: bridgeUrl,
      method: 'POST',
      body
    }).then(() => {
      this.log(`Set to "${on}" success`)
      next()
    }).catch(error => {
      this.logError(error)
      next(error)
    })
  }
}

const SetFixture = function (fixture) {
  return function (on, next) {
    this.log(`Calling set fixture. Doing nothing.`)
    next()
    return Promise.resolve()
  }
}

class CharacteristicMethods {
  constructor (config, bridgeUrl, notifications) {
    const setAbility = config.set && config.set.ability
    const setAbilityUrl = setAbility ? `${bridgeUrl}${setAbility}` : null
    const setAbilityDataType = config.set && config.set.dataType

    const getAbility = config.get && config.get.ability
    const getAbilityUrl = getAbility ? `${bridgeUrl}${getAbility}` : null
    const getFixture = config.get && config.get.fixture

    this.get = getAbility ? new GetBridge(getAbilityUrl) : new GetFixture(getFixture)
    this.set = setAbility ? new SetBridge(setAbilityUrl, setAbilityDataType) : new SetFixture()

    if (notifications && config.notify && config.notify.ability) {
      this.emitter = notifications.getEmitter(config.notify.ability, config.notify.dataType)
    }
  }
}

module.exports = CharacteristicMethods
