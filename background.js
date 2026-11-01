async function restoreTabs(urls, windowId) {
  let lastTabId;
  for (const url of urls) {
    const tab = await chrome.tabs.create({ url, windowId, active: false });
    lastTabId = tab.id;
  }
  if (lastTabId !== undefined) {
    await chrome.tabs.update(lastTabId, { active: true });
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "restore-tabs" || !Array.isArray(message.tabs)) {
    return;
  }

  restoreTabs(message.tabs, message.windowId)
    .then(() => sendResponse({ ok: true }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});
