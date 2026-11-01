const status = document.getElementById("status");
const fileInput = document.getElementById("file-input");

function report(message, isError = false) {
  status.textContent = message;
  status.dataset.error = String(isError);
}

async function getScopeTabs(scope) {
  if (scope === "all") {
    return chrome.tabs.query({});
  }

  const currentWindow = await chrome.windows.getCurrent();
  return chrome.tabs.query({ windowId: currentWindow.id });
}

async function saveTabs(scope) {
  try {
    const tabs = await getScopeTabs(scope);
    const savedTabs = tabs
      .filter((tab) => typeof tab.url === "string" && /^https?:\/\//i.test(tab.url))
      .map(({ title, url }) => ({ title: title || url, url }));

    if (savedTabs.length === 0) {
      report("No web tabs found to save.", true);
      return;
    }

    const backup = {
      format: "tab-saver",
      version: 1,
      savedAt: new Date().toISOString(),
      tabs: savedTabs
    };
    const blobUrl = URL.createObjectURL(
      new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })
    );
    const date = new Date().toISOString().slice(0, 10);

    try {
      await chrome.downloads.download({
        url: blobUrl,
        filename: `tab-saver-${date}.json`,
        conflictAction: "uniquify",
        saveAs: true
      });
      report(`Saved ${savedTabs.length} tab${savedTabs.length === 1 ? "" : "s"}.`);
    } finally {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    }
  } catch (error) {
    report(`Could not save tabs: ${error.message}`, true);
  }
}

function parseBackup(value) {
  if (!value || value.format !== "tab-saver" || value.version !== 1 || !Array.isArray(value.tabs)) {
    throw new Error("This is not a supported Tabstash backup.");
  }

  const tabs = value.tabs.filter(
    (tab) => tab && typeof tab.url === "string" && /^https?:\/\//i.test(tab.url)
  );
  if (tabs.length === 0) {
    throw new Error("The backup contains no valid web links.");
  }
  return tabs;
}

async function restoreFile(file) {
  if (!file) return;

  try {
    const contents = await file.text();
    let parsed;
    try {
      parsed = JSON.parse(contents);
    } catch {
      throw new Error("The selected file is not valid JSON.");
    }

    const tabs = parseBackup(parsed);
    const currentWindow = await chrome.windows.getCurrent();
    await chrome.runtime.sendMessage({
      type: "restore-tabs",
      tabs: tabs.map(({ url }) => url),
      windowId: currentWindow.id
    });
    report(`Opening ${tabs.length} tab${tabs.length === 1 ? "" : "s"}.`);
  } catch (error) {
    report(`Could not restore tabs: ${error.message}`, true);
  } finally {
    fileInput.value = "";
  }
}

document.getElementById("save-current").addEventListener("click", () => saveTabs("current"));
document.getElementById("save-all").addEventListener("click", () => saveTabs("all"));
document.getElementById("choose-file").addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => restoreFile(fileInput.files[0]));


