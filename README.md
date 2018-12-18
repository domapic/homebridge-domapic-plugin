# Homebridge Domapic Plugin

> Domapic Plugin that automatically register Domapic abilities as Apple's HomeKit accessories (using the awesome [Homebridge][homebridge-url])

[![Build status][travisci-image]][travisci-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Quality Gate][quality-gate-image]][quality-gate-url] [![js-standard-style][standard-image]][standard-url]

[![NPM dependencies][npm-dependencies-image]][npm-dependencies-url] [![Last commit][last-commit-image]][last-commit-url] <!--[![Last release][release-image]][release-url] -->

[![NPM downloads][npm-downloads-image]][npm-downloads-url] [![License][license-image]][license-url]

## Intro

The Homebridge Domapic Plugin retrieves the information about modules and abilities registered in your Domapic Controller, and automatically configures and starts an underlay Homebridge server that will act as a bridge between Apple's HomeKit and the Domapic abilities.

Since Siri supports devices added through HomeKit, this means that **with this plugin you can ask Siri to control your own-made Domapic modules:**

* _"Siri, turn on the living room light"_
* _"Siri, open the garage door"_
* _"Siri, activate my awesome webhook"_

## Prerequisites

[Domapic Controller][domapic-controller-url] has to be installed and running in your LAN.  
At least one Domapic module, such as [relay-domapic-module][relay-domapic-module-url] has to be installed and connected to the Controller.  
Also read the system requisites of [Homebridge][homebridge-url], which is used underlay to connect with HomeKit.

## Installation

```bash
npm i homebridge-domapic-plugin -g --unsafe-perm
```

## Start the plugin

Start the plugin providing the Controller url and connection token:

```bash
domapic-homebridge start --controller=http://192.168.1.100:3000 --controllerApiKey=foo-api-key
```

The plugin will be started in background using [pm2][pm2-url]

To display logs, type:

```bash
domapic-homebridge logs --lines=200
```

Once the Plugin has connected with the Controller, the Homebridge server will be started, and a QR code will be displayed in logs:

![HomeKit connection QR][homekit-connection-qr-image]

**Scan this code with your HomeKit app on your iOS device to add your accessories.**

From now, all modules added to your Controller will automatically be added to your HomeKit app too, and **will be available through Siri**.

## Options

The plugin, apart of all common [domapic services options][domapic-service-options-url], provides custom options for configuring it:

* `homebridgePort` - Number defining the port that Homebridge server will use.

```bash
domapic-homebridge start --homebridgePort=3200
```

## Configuring modules

This plugin requires some extra configuration in modules in order to match the module abilities with the correspondant HomeKit accessory characteristics.

This configuration can be found in the Domapic Controller, as "servicePluginConfigs" entities. Modules can define a default configuration for this plugin using the `addPluginConfig` method. (Read the [domapic-service documentation][domapic-service-url] for further info)

> Certain types of abilities are registered as accessories automatically if no plugin configuration is found for the module:  
	- Abilities that have "boolean" data type and have both `state` and `action` are being exposed as HomeKit `Switch` accesories.  
	- Abilities without data type that have an `action` defined are being exposed as HomeKit `Switch` accesories, but returning always `false` as state.

Here is an example of a module configuration:

```js
{
  "pluginPackageName": "homebridge-domapic-plugin", // DEFINE CONFIGURATION FOR THIS PLUGIN
  "config": {
    "accessories": [
      {
        "accessory": "Switch", // HomeKit Accessory name
        "characteristics": [
          {
            "characteristic": "On", // HomeKit Characteristic
            "get": {
              "ability": "switch" // Module ability to use when Homekit calls to "read" Characteristic
            },
            "set": {
              "ability": "switch" // Module ability to use when Homekit calls to "write" Characteristic
            } 
          }
        ]
      },
      {
        "accessory": "Switch", // HomeKit Accessory name
        "characteristics": [
          {
            "characteristic": "On", // HomeKit Characteristic
            "get": {
              "fixture": true // When Homekit calls to "read" Characteristic will always return true.
            },
            "set": {
              "ability": "toggle" // Module ability to use when Homekit calls to "write" Characteristic
            } 
          }
        ]
      }
    ]
  }
}

```

Some points to take into account when defining configuration are:

* Data type that a module ability handles has to be equivalent to the data type that the correspondant HomeKit Characteristic expects.
* You can use the `fixture` property when a required Characteristic is not available in your module. (In this way, an ability with only an action and no state (a "button" behavior, for example), can be mapped into a "Switch" accessory, as seen in the example above)
* A Domapic module can be mapped into one or many Homekit accesories, as seen in the example above.
* Configuration can be modified by Domapic administrators in the Domapic Controller. The configuration defined programatically from module through the `addPluginConfig` method will define only the default configuration.
* Read the [HAP-NodeJs][hap-nodejs-url] documentation to check all available HomeKit Accessories and required Characteristics for each of them, as well as expected data type for each Characteristic. Supported Accessories by this plugin are listed below.


## Supported HomeKit Accessories

Here is the list of currently supported HomeKit Accessories, and its related Characteristics:

* Switch
	* On - `<boolean>` data type.
* ContactSensor
	* ContactSensorState - `<boolean>` data type.

Accessories support will increase on next versions of this plugin.


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

[pm2-url]: http://pm2.keymetrics.io/
[homebridge-url]: https://www.npmjs.com/package/homebridge
[domapic-controller-url]: https://www.npmjs.com/package/domapic-controller
[relay-domapic-module-url]: https://www.npmjs.com/package/relay-domapic-module
[domapic-service-url]: https://github.com/domapic/domapic-service
[hap-nodejs-url]: https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js
[domapic-service-options-url]: https://github.com/domapic/domapic-service#options

[homekit-connection-qr-image]: http://domapic.com/assets/homebridge_qr_screenshot.jpg
