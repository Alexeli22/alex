# CLAUDE.md — AI Assistant Guide for `alex`

This file provides context and conventions for AI assistants working in this repository.

## Repository Overview

- **Name:** alex
- **Owner:** Alexeli22
- **Description:** A Hebrew-language digital compass Progressive Web App (PWA)
- **Remote:** `Alexeli22/alex` on GitHub
- **Language:** Hebrew (`he`) with right-to-left (RTL) text direction
- **App Name:** מצפן (Compass)

## Project Structure

```
alex/
├── index.html         # Main HTML page (Hebrew, RTL)
├── style.css          # Styles — mobile-first, dark theme, responsive
├── compass.js         # Compass class — Device Orientation API, animation, UI
├── manifest.json      # PWA manifest — installability, standalone mode
├── sw.js              # Service worker — offline caching (cache-first strategy)
├── compass-icon.svg   # SVG app icon (512x512 viewBox, matches theme colors)
├── CLAUDE.md          # This file — AI assistant guide
└── .git/              # Git metadata
```

## Dependencies

**None.** This is a vanilla HTML, CSS, and JavaScript application with zero external dependencies — no npm, no package.json, no CDN scripts, no frameworks.

## Build & Run

This is a static web application — **no build step required**.

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

Then open `http://localhost:8000` on a mobile device (must be on the same network).

**Important:** The Device Orientation API requires HTTPS in production. For local testing, `localhost` is exempt from this requirement.

## Testing

> **TODO:** No testing framework is configured. Document testing commands and conventions once tests are added.

## Code Style & Linting

> **TODO:** No linter or formatter is configured. Document tools and style guides once set up.

### Current conventions (inferred from the codebase)

- ES6+ class syntax, `async`/`await` for permissions
- Descriptive variable and method names
- JSDoc-style comment at the top of `compass.js`
- Inline comments for non-obvious logic (orientation handling, wraparound math)
- CSS uses BEM-like naming (`.compass-circle`, `.direction-marker.north`, `.needle-north`)
- Mobile-first responsive design with `@media` breakpoints

## Architecture

### Overview

Mobile-first Progressive Web App that uses the Device Orientation API to function as a real compass. The UI is entirely in Hebrew with RTL layout. The compass needle stays fixed on screen while the compass dial rotates beneath it, so the "צ" (North) marker always points toward magnetic north.

### Data Flow

```
User taps "הפעל מצפן" (Start)
    ↓
[iOS 13+?] → requestPermission() → granted/denied
    ↓
enableCompass() → registers orientation event listeners
    ↓
deviceorientation / deviceorientationabsolute events fire
    ↓
handleOrientation() → extracts heading:
  • iOS: event.webkitCompassHeading (degrees from north)
  • Android: 360 - event.alpha
    ↓
targetHeading is set (0–360°)
    ↓
animate() loop (requestAnimationFrame):
  • Interpolates currentHeading → targetHeading (0.15 easing)
  • Handles 360°/0° wraparound via shortest-path logic
    ↓
updateCompass() → applies visual updates:
  • Rotates .compass-circle by -heading degrees
  • Updates degree display (rounded integer)
  • Updates Hebrew direction name (8 cardinal/ordinal directions)
```

### File-by-File Details

#### `index.html`
- HTML5 document, `lang="he" dir="rtl"`
- PWA meta tags: `apple-mobile-web-app-capable`, `theme-color` (`#1a1a2e`)
- Compass UI structure: rotating `.compass-circle` with direction markers (צ/מ/ד/מע), fixed needle overlay, heading display, direction name, status message, start and calibrate buttons
- Loads `style.css` and `compass.js` (no other scripts)

#### `compass.js` (~200 lines)
- **`Compass` class** — single class that owns all logic
  - `constructor()` — grabs DOM references, initializes state (`currentHeading`, `targetHeading`, `isRunning`), calls `init()`
  - `init()` — attaches button handlers, checks API support, disables button if unsupported
  - `isSupported()` — checks `'DeviceOrientationEvent' in window`
  - `start()` — async; handles iOS permission flow via `DeviceOrientationEvent.requestPermission()`
  - `enableCompass()` — hides start button, shows calibrate button, starts `animate()` loop, adds orientation event listeners
  - `handleOrientation(event)` — extracts heading from `webkitCompassHeading` (iOS) or `alpha` (Android), normalizes to 0–360°
  - `animate()` — `requestAnimationFrame` loop; interpolates heading with 0.15 easing factor, handles 360°↔0° wraparound
  - `updateCompass(heading)` — rotates compass circle (`-heading` deg), updates heading text and direction name
  - `getDirectionName(heading)` — maps degree to one of 8 Hebrew cardinal/ordinal names (צפון, צפון-מזרח, מזרח, דרום-מזרח, דרום, דרום-מערב, מערב, צפון-מערב)
  - `calibrate()` — shows instruction to move phone in figure-8 motion
  - `showStatus(message, type)` — sets status text with optional `error`/`success` CSS class
  - `stop()` — cancels animation frame, removes event listeners
- **Initialization:** creates `window.compass` on `DOMContentLoaded`
- **Service worker registration:** registered on `window.load`

#### `style.css` (~320 lines)
- **Color scheme:** dark blue gradient background (`#1a1a2e → #16213e → #0f3460`), red accent for north (`#ff4757`), gray for other directions, blue glow highlights
- **Compass visual:** 280×280px (responsive: 240px on small screens, 300px on tall screens), radial gradient with box shadows, `0.1s ease-out` transition on rotation
- **Compass rose:** decorative concentric circles using `repeating-conic-gradient`
- **Needle:** CSS border-trick triangles (red north, gray south), white center pivot
- **Fixed indicator:** red triangle at the top of the compass (does not rotate)
- **Buttons:** `.start-btn` with purple gradient, `.calibrate-btn` transparent with border
- **Typography:** system font stack, 64px heading value, 24px direction name
- **Responsive breakpoints:** `max-width: 350px` (smaller compass), `min-height: 700px` (larger compass + gaps)
- **Animations:** `@keyframes pulse` for loading state

#### `manifest.json`
- App name: "מצפן" (Hebrew for "Compass")
- `display: "standalone"` — opens without browser chrome
- `orientation: "portrait"` — locked to portrait
- Single SVG icon with `purpose: "any maskable"` for adaptive icon support
- Theme/background color: `#1a1a2e`

#### `sw.js` (~39 lines)
- Cache name: `compass-v1` (versioned for cache busting)
- Pre-caches 6 assets: `/`, `/index.html`, `/style.css`, `/compass.js`, `/compass-icon.svg`, `/manifest.json`
- **Install:** caches all assets, calls `skipWaiting()`
- **Activate:** deletes old cache versions, calls `clients.claim()`
- **Fetch:** cache-first strategy — serve from cache, fall back to network

#### `compass-icon.svg`
- 512×512 SVG matching the app's dark theme
- Contains compass dial with N/S/E/W markers, red/gray needle, center dot
- Uses inline gradients matching the CSS color scheme

### Key Design Decisions

1. **Smooth animation:** heading changes are interpolated (0.15 easing), not snapped instantly
2. **Shortest-path wraparound:** transitions from 350° to 10° go forward 20° (not backward 340°)
3. **Platform-specific heading:** iOS provides `webkitCompassHeading`; Android uses `360 - alpha`
4. **Permission-first on iOS:** iOS 13+ requires a user gesture to grant sensor access
5. **Offline-capable:** service worker caches the entire app for use without network
6. **No build step:** keeps the development loop as simple as possible

### Browser Support

- iOS Safari 13+ (requires explicit user permission for sensors)
- Chrome for Android
- Samsung Internet
- Other mobile browsers with magnetometer/gyroscope support
- **Requirement:** device must have a magnetometer hardware sensor
- **Graceful degradation:** shows error message and disables start button if API is not available

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

### Service Worker Cache Updates

When adding, removing, or renaming files:
1. Update the `ASSETS` array in `sw.js` to include any new files
2. Bump the `CACHE_NAME` version string (e.g., `compass-v1` → `compass-v2`) so returning users get fresh assets

## Conventions for AI Assistants

1. **Read before editing.** Always read a file before modifying it.
2. **Minimal changes.** Only change what is requested — avoid unnecessary refactoring.
3. **No over-engineering.** Keep solutions simple and focused on the current task.
4. **Security first.** Never introduce common vulnerabilities (injection, XSS, etc.).
5. **No secrets in code.** Never commit credentials, API keys, or .env files.
6. **Preserve the Hebrew UI.** All user-facing strings are in Hebrew. New UI text must also be in Hebrew. Maintain RTL layout.
7. **Keep it vanilla.** Do not introduce npm, frameworks, or external dependencies unless explicitly requested.
8. **Update the service worker.** When adding or renaming files, update `sw.js` (`ASSETS` array and `CACHE_NAME`).
9. **Test on mobile.** The compass only works on devices with a magnetometer. Test with a local static server and a mobile device on the same network.
10. **Update this file.** When adding significant infrastructure (build system, CI, testing, linting), update the relevant section of this CLAUDE.md.
