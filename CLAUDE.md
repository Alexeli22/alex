# CLAUDE.md — AI Assistant Guide for `alex`

This file provides context and conventions for AI assistants working in this repository.

## Repository Overview

- **Name:** alex
- **Owner:** Alexeli22
- **Status:** Mobile compass web application (PWA)
- **Remote:** `Alexeli22/alex` on GitHub

## Project Structure

```
alex/
├── index.html         # Main HTML page
├── style.css          # Styles (mobile-first, dark theme)
├── compass.js         # Compass logic using Device Orientation API
├── manifest.json      # PWA manifest
├── sw.js              # Service worker for offline support
├── compass-icon.svg   # App icon
├── CLAUDE.md          # This file — AI assistant guide
└── .git/              # Git metadata
```

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

This is a static web application — no build step required.

### Running Locally

Use any static file server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` on your mobile device (must be on same network).

**Important:** Device orientation requires HTTPS in production. For local testing, `localhost` is allowed.

## Testing

> **TODO:** Document testing framework, commands, and conventions once tests are added.

## Code Style & Linting

> **TODO:** Document linting tools, formatters, and style guides once configured.

## Dependencies

No external dependencies — vanilla HTML, CSS, and JavaScript only.

## Architecture

### Overview

Mobile-first Progressive Web App (PWA) that uses the Device Orientation API to function as a real compass.

### Key Components

- **Compass class** (`compass.js`) — Handles device orientation events, calculates heading, animates compass rotation
- **Device Orientation API** — Uses `deviceorientation` and `deviceorientationabsolute` events
- **iOS Compatibility** — Handles `DeviceOrientationEvent.requestPermission()` for iOS 13+
- **PWA** — Service worker for offline caching, manifest for installability

### Browser Support

- iOS Safari 13+ (requires user permission)
- Chrome for Android
- Samsung Internet
- Other mobile browsers with magnetometer support

## Conventions for AI Assistants

1. **Read before editing.** Always read a file before modifying it.
2. **Minimal changes.** Only change what is requested — avoid unnecessary refactoring.
3. **No over-engineering.** Keep solutions simple and focused on the current task.
4. **Security first.** Never introduce common vulnerabilities (injection, XSS, etc.).
5. **No secrets in code.** Never commit credentials, API keys, or .env files.
6. **Test your changes.** Run the test suite (when available) before considering a task complete.
7. **Update this file.** When adding significant infrastructure (build system, CI, testing, linting), update the relevant section of this CLAUDE.md.
