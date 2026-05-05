# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack Constraints

**Strictly vanilla JavaScript, HTML, and CSS.** No frameworks (React, Vue, Angular, Svelte), no TypeScript, no build tools, no `npm install`. Every `.html` file is runnable by opening it directly in a browser.

## Running the App

Open any `.html` file directly in a browser — no server needed. `index.html` is the main hub. Module pages (`modules/*/`) can be opened standalone.

**Backend setup (one-time per GM):**
1. Deploy `Google_App_Scripts_Code/Code.gs` as a Google Apps Script Web App ("Execute as: Me", "Who has access: Anyone").
2. Store the resulting Web App URL in browser `localStorage` under the key `voidLinkServer`. The login screen captures this.

## Architecture

```
index.html          ← Login shell + terminal grid layout (CSS Grid)
js/datasworn.js     ← Fetches Datasworn V2 JSON from jsDelivr CDN → window.dataswornCore
js/sync.js          ← REST client for Google Apps Script backend → window.gLink
css/style.css       ← Global cyberpunk/terminal styles
modules/*/          ← Feature pages loaded as iframes inside the terminal grid
Google_App_Scripts_Code/Code.gs  ← Serverless backend; reads/writes Google Sheets + Docs
```

### Global Objects

| Global | Source | Purpose |
|--------|--------|---------|
| `window.dataswornCore` | `datasworn.js` | Game rules/content from Datasworn CDN |
| `window.dataswornReady` | `datasworn.js` | Promise that resolves when data is loaded |
| `window.gLink` | `sync.js` | Persistence API (save/load stats, log narrative, sector archive) |

### Data Flow

1. `datasworn.js` fetches `https://cdn.jsdelivr.net/npm/@datasworn/starforged/json/starforged.json` → `window.dataswornCore.data`
2. UI modules call `window.dataswornCore.getAssets()`, `findNode(idSnippet)`, `rollOracle(idSnippet)` to read game content
3. State changes call `window.gLink.saveStatServer(charId, field, value)` or `logServer(charId, message)` → POSTs to Apps Script → Google Sheets/Docs

### Backend API (Code.gs)

POST payloads use `text/plain` content-type to bypass CORS. All payloads must include `action` and `id` (the character callsign). Supported actions:

- `saveStat` — upserts a stat column in the "Stat" sheet (columns are created on demand)
- `loadStats` — returns a row object keyed by column header
- `logEntry` — appends a timestamped line to a Google Doc (doc ID stored in Settings sheet B3)
- `saveSector` / `getSectorList` / `loadSector` — manages the "Sector_Archive" sheet

## Datasworn V2 Schema

Use `$id`, not `_id`. Key helpers:
- `window.dataswornCore.findNode(idSnippet)` — recursive search by partial `$id`
- `window.dataswornCore.getAssets()` — handles `assets` vs `asset_collections` naming variation
- Oracle rows: check `text`, `result`, or `name` for display value; check `floor`/`min` and `ceiling`/`max` for roll ranges
- `OracleSet` hierarchies use an `ancestors` array instead of `Category`/`Member of`
- Tables have `summary` alongside or instead of `description`

## Design System

Dark cyberpunk/terminal aesthetic. Use these CSS variables defined in `index.html` and `style.css`:

```css
--neon: #00ff9d;    /* primary accent — neon green */
--bg: #050508;      /* page background */
--panel: #0b0d12;   /* card/panel background */
--border: #1a1c23;  /* divider lines */
```

Fonts: `Share Tech Mono` (terminal text), `Exo 2` (headings). All new UI must match this aesthetic.

## Git Workflow

- **Never push directly to `main`.** `main` is a live CDN — a broken commit breaks every active player's session.
- All work goes on `development` or a feature branch off `development` (e.g., `feature/dice-roller`).
- PRs target `development`. Only the maintainer merges `development` → `main` after testing.
