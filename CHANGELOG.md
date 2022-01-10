# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 0.1.0-beta-004 - 2022-01-10

### Added

* Add README.md instructions
* Allow to run the CLI tool by calling `pg-migrate`

### Fixed

* Fix `pg-monitor` attachment when running in verbo mode
* Fix migration name parser, to capture correctly the number and not just a single digit.

### Changed

* Re-create a new connection before running each migration

    Before, we were just running them in different transactions, but it could cause errors
    when enabling an extension.

    For example, when enabling `POSTGIS`, the POSTGIS types where not avaible in the futher migrations.

## 0.1.0-beta-003 - 2022-01-07

### Fixed

* Don't fail if the `migrations` folder is missing.
* Use a different alias for password options: `-w`
* Fix support of lower version of Node.js

## 0.1.0-beta-002 - 2021-09-20

### Added

* Add `bin` property to the `package.json`

## 0.1.0-beta-001 - 2021-09-20

### Added

* Initial release

