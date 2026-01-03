# Changelog

> **Template**: Copy this file to `02_CHANGELOG.md` and maintain release history.
> Updated automatically by `/build/feature` and `/docs/update changelog` commands.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- [New features added to development]

### Changed
- [Changes to existing functionality]

### Deprecated
- [Features that will be removed in future]

### Removed
- [Features that were removed]

### Fixed
- [Bug fixes]

### Security
- [Security improvements or fixes]

---

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
- Feature 1: [Brief description]
- Feature 2: [Brief description]
- Feature 3: [Brief description]

### Infrastructure
- Set up development environment
- Configured CI/CD pipeline
- Added automated tests

---

## [0.2.0] - YYYY-MM-DD

### Added
- [Feature or improvement]

### Fixed
- [Bug fix description with issue reference if applicable]

### Changed
- [Breaking or non-breaking change]

---

## [0.1.0] - YYYY-MM-DD

### Added
- Initial project setup
- Basic project structure
- Core dependencies

---

## Template for New Entries

Use this template when adding new changelog entries:

```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature X that allows users to Y
- New API endpoint `/api/resource`

### Changed
- Updated component Z to improve performance
- Modified database schema for table ABC

### Fixed
- Fixed issue where X would cause Y (#123)
- Resolved race condition in Z

### Security
- Updated dependency X to patch CVE-YYYY-NNNNN
```

## Release Checklist

Before creating a new release:
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version number bumped in package.json/pyproject.toml
- [ ] Changelog updated
- [ ] Git tag created
- [ ] Release notes prepared
