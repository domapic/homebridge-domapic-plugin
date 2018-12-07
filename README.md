# Homebridge Domapic Plugin

> Domapic Plugin that automatically register Domapic abilities as Apple's Homekit accessories (using the awesome [Homebridge][homebridge-url])

[![Build status][travisci-image]][travisci-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Quality Gate][quality-gate-image]][quality-gate-url] [![js-standard-style][standard-image]][standard-url]

[![NPM dependencies][npm-dependencies-image]][npm-dependencies-url] [![Last commit][last-commit-image]][last-commit-url] <!--[![Last release][release-image]][release-url] -->

[![NPM downloads][npm-downloads-image]][npm-downloads-url] [![License][license-image]][license-url]

## Intro

The Homebridge Domapic Plugin retrieve the information about modules and abilities registered in your Domapic Controller, and automatically configure and starts an underlay Homebridge server that will act as a bridge between Apple's Homekit and the Domapic abilities.

Since Siri supports devices added through HomeKit, this means that with this plugin you can ask Siri to control your own-made Domapic modules:

* _"Siri, turn on the living room light"_
* _"Siri, open the garage door"_
* _"Siri, turn on the awesome webhook"_

For now, only abilities which have "boolean" data type that have both `state` and `action` are being exposed as Homekit `Switch` accessories. Soon will be added custom plugin configuration for abilities to [Domapic Controller][domapic-controller-url], and then the user will be able to decide which type of accessory should be each ability, as long as data type is compatible.


[coveralls-image]: https://coveralls.io/repos/github/domapic/homebridge-domapic-plugin/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/domapic/homebridge-domapic-plugin
[travisci-image]: https://travis-ci.org/domapic/homebridge-domapic-plugin.svg?branch=master
[travisci-url]: https://travis-ci.org/domapic/homebridge-domapic-plugin
[last-commit-image]: https://img.shields.io/github/last-commit/domapic/homebridge-domapic-plugin.svg
[last-commit-url]: https://github.com/domapic/homebridge-domapic-plugin/commits
[license-image]: https://img.shields.io/npm/l/homebridge-domapic-plugin.svg
[license-url]: https://github.com/domapic/homebridge-domapic-plugin/blob/master/LICENSE
[npm-downloads-image]: https://img.shields.io/npm/dm/homebridge-domapic-plugin.svg
[npm-downloads-url]: https://www.npmjs.com/package/homebridge-domapic-plugin
[npm-dependencies-image]: https://img.shields.io/david/domapic/homebridge-domapic-plugin.svg
[npm-dependencies-url]: https://david-dm.org/domapic/homebridge-domapic-plugin
[quality-gate-image]: https://sonarcloud.io/api/project_badges/measure?project=homebridge-domapic-plugin&metric=alert_status
[quality-gate-url]: https://sonarcloud.io/dashboard?id=homebridge-domapic-plugin
[release-image]: https://img.shields.io/github/release-date/domapic/homebridge-domapic-plugin.svg
[release-url]: https://github.com/domapic/homebridge-domapic-plugin/releases
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/

[homebridge-url]: https://www.npmjs.com/package/homebridge
[domapic-controller-url]: https://www.npmjs.com/package/domapic-controller
