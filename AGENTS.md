# Tabstash Extension

A standalone Manifest V3 Chrome extension that exports HTTP/HTTPS tab URLs and titles to JSON and restores them as tabs.

## Current status

- Popup supports saving the current window or all tabs visible to its current Chrome context, plus restoring a JSON backup.
- Incognito support uses split mode and requires the user to enable **Allow in Incognito** in Chrome.
- Manual verification in Chrome remains: load unpacked, test regular-window save/restore, then enable Incognito and test there.

## Conventions

- Keep the extension dependency-free and the UI intentionally small.
- Keep backup format versioned (`format: tab-saver`, `version: 1`).
- Limit saved/restored links to HTTP and HTTPS URLs; never store cookies or page content.
