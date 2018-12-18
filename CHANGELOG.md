# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [unreleased]
### Added
### Changed
### Fixed
### Removed

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
