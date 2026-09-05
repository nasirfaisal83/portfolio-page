---
inclusion: always
---

# Project Structure

## Current State
This is a new repository with minimal structure. The project organization will be established as development begins.

## Directory Structure
```
HasoubLabs/
├── .kiro/              # Kiro AI configuration
│   └── steering/       # Project steering documents
└── (project files to be added)
```

## Organization Principles

### To Be Established
As the project grows, consider organizing by:
- **By Feature**: Group related functionality together (common in modern applications)
- **By Layer**: Separate concerns (e.g., controllers, services, models, views)
- **By Module**: Organize into independent, reusable modules
- **Hybrid**: Combination of the above based on specific needs

## Recommended Patterns

### Source Code
- Place source code in a dedicated directory (e.g., `src/`, `lib/`, `app/`)
- Keep configuration files at the root level
- Separate application code from tooling/infrastructure code

### Tests
- Colocate tests with source files, OR
- Maintain a parallel `tests/` or `__tests__/` directory
- Use clear naming conventions (e.g., `*.test.js`, `*.spec.ts`, `*_test.py`)

### Documentation
- Keep a comprehensive `README.md` at the root
- Add inline code documentation
- Consider a `docs/` directory for extensive documentation

### Assets & Resources
- Store static assets in a dedicated directory (e.g., `public/`, `assets/`, `static/`)
- Keep resource files organized by type (images, fonts, data files)

## File Naming Conventions
_To be established based on chosen language and framework_

## Code Organization Guidelines
_To be defined as patterns emerge:_
- Module boundaries and dependencies
- Code reuse strategies
- Separation of concerns
- Interface definitions
