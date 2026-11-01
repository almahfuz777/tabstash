# Tabstash

<p align="center"><img src="assets/tabstash-logo.svg" alt="Tabstash logo" width="160"></p>

A lightweight Chrome extension for saving open web links to a JSON file and restoring them as tabs whenever you need them.

## Features

- Save tabs from the current window or all windows in the current Chrome context.
- Restore links from a previously saved JSON file.
- Use it in regular or Incognito windows after enabling Incognito access.
- Keep backups as local files you choose where to save.

The extension stores tab titles and HTTP/HTTPS URLs. It does not save cookies, sign-in sessions, page contents, or browsing history elsewhere.

## Install locally

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode**.
4. Select **Load unpacked** and choose the extension folder containing `manifest.json`.
5. To use the extension in Incognito, open its **Details** page and turn on **Allow in Incognito**.

## Use

Select the Tabstash toolbar icon:

- Choose **Current window** to save web tabs in that window.
- Choose **All windows** to save web tabs visible in the current regular or Incognito context.
- Choose **Choose JSON file** to restore a saved backup. Restored tabs open in the same context as the window where you opened the extension.

Regular and Incognito windows are isolated by Chrome. To save or restore Incognito tabs, open the extension from an Incognito window. Chrome requires this access to be enabled explicitly.

## Backup format

Backups are JSON files with a format identifier and version, a save timestamp, and a list of tab titles and URLs:

```json
{
  "format": "tab-saver",
  "version": 1,
  "savedAt": "2026-11-01T12:00:00.000Z",
  "tabs": [
    {
      "title": "Example Domain",
      "url": "https://example.com/"
    }
  ]
}
```

## Permissions

- `tabs`: read tab URLs and titles to create the backup.
- `downloads`: save the backup JSON file.

The extension does not request access to website contents or remote services.

## Development

This is a dependency-free Manifest V3 extension. Load the extension unpacked to try local changes. After editing extension files, use **Reload** on its card at `chrome://extensions`.
