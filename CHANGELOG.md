# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [unreleased]
### Added
### Changed
### Fixed
### Removed

## [1.0.0-beta.6] - 2019-01-06
### Changed
- Upgrade domapic-service version. Connection will not work with domapic-controller versions lower than 1.0.0-alpha.14.

## [1.0.0-beta.5] - 2018-12-29
### Added
- Add TemperatureSensor plugin.
- Add HumiditySensor plugin.
- Add "notify" behavior to Switch plugin.

### Changed
- Wait 10 seconds when stopping homebridge server until it has been really closed.

## [1.0.0-beta.4] - 2018-12-22
### Added
- Add "notifications" feature. Add "notify" property to configuration in order to map an ability state into a HomeKit notification.

### Changed
- Change accessories default name. Add service name after accesory name.

## [1.0.0-beta.3] - 2018-12-18
### Added
- Use controller services and configs instead of abilities to map HomeKit accessories
- Upgrade domapic-service dependency
- Add ContactSensor Plugin Factory.
- Extend plugins factories from Plugin Class.
- Use CharacteristicMethods Class for all plugins bridges

## [1.0.0-beta.2] - 2018-12-09
### Added
- Add Button accessory. Register abilities with action and no data type defined as Buttons

### Changed
- Set Homebridge server name from service name
- Set Homebridge server random mac, unique by plugin instance
- Upgraded domapic-service dependency

### Fixed
- Write homebridge config in domapic storage folder instead of a child of package folder

## [1.0.0-beta.1] - 2018-12-07
### Added
- First prerelease
- Register boolean abilities as Switch accessories
