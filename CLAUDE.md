# CLAUDE.md — AI Assistant Guide for `alex`

This file provides context and conventions for AI assistants working in this repository.

## Repository Overview

- **Name:** alex
- **Owner:** Alexeli22
- **Status:** Newly initialized — this is a fresh repository with no application code yet.
- **Remote:** `Alexeli22/alex` on GitHub

## Project Structure

```
alex/
├── CLAUDE.md          # This file — AI assistant guide
└── .git/              # Git metadata
```

> **Note:** Update this section as the project grows with source directories, config files, and documentation.

## Development Workflow

### Branching

- Feature branches follow the pattern: `claude/<descriptor>-<session-id>`
- Always push with: `git push -u origin <branch-name>`
- Branch names starting with `claude/` are used for AI-assisted development sessions.

### Commits

- Use clear, descriptive commit messages.
- Prefer imperative mood (e.g., "Add feature" not "Added feature").
- Keep commits focused — one logical change per commit.

### Pull Requests

- Target the main/default branch unless otherwise specified.
- Include a summary of changes and motivation.

## Build & Run

> **TODO:** Document build commands, prerequisites, and run instructions once the project has application code.

## Testing

> **TODO:** Document testing framework, commands, and conventions once tests are added.

## Code Style & Linting

> **TODO:** Document linting tools, formatters, and style guides once configured.

## Dependencies

> **TODO:** Document package manager, key dependencies, and installation steps once a dependency manifest is added.

## Architecture

> **TODO:** Document high-level architecture, key modules, and design decisions as the project takes shape.

## Conventions for AI Assistants

1. **Read before editing.** Always read a file before modifying it.
2. **Minimal changes.** Only change what is requested — avoid unnecessary refactoring.
3. **No over-engineering.** Keep solutions simple and focused on the current task.
4. **Security first.** Never introduce common vulnerabilities (injection, XSS, etc.).
5. **No secrets in code.** Never commit credentials, API keys, or .env files.
6. **Test your changes.** Run the test suite (when available) before considering a task complete.
7. **Update this file.** When adding significant infrastructure (build system, CI, testing, linting), update the relevant section of this CLAUDE.md.
