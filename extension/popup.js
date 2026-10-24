
const api = globalThis.browser || globalThis.chrome;
const $ = (id) => document.getElementById(id);
let allTabs = [];
let secondsLeft = 25 * 60;
let timerHandle = null;
let running = false;
const SESSION_LENGTH = 25 * 60;

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timeout);
  notify.timeout = setTimeout(() => toast.classList.remove("show"), 2400);
}
function safeDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return "special browser page"; }
}
function eligible(tab) { return Boolean(tab.url && /^https?:\/\//i.test(tab.url)); }
async function getSaved() {
  const data = await api.storage.local.get({ vault: [] });
  return Array.isArray(data.vault) ? data.vault : [];
}
async function setSaved(vault) { await api.storage.local.set({ vault }); }

function applyTheme(theme) {
  const chosen = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = chosen;
  $("themeBtn").textContent = chosen === "dark" ? "☼" : "☾";
  $("themeBtn").title = chosen === "dark" ? "Switch to light mode" : "Switch to dark mode";
  $("themeBtn").setAttribute("aria-label", $("themeBtn").title);
}
async function initTheme() {
  const saved = await api.storage.local.get({ theme: "dark" });
  applyTheme(saved.theme);
}
$("themeBtn").addEventListener("click", async () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  await api.storage.local.set({ theme: next });
});

async function renderTabs() {
  allTabs = await api.tabs.query({});
  $("tabCount").textContent = allTabs.length;
  $("tabWord").textContent = allTabs.length === 1 ? "open tab" : "open tabs";
  const list = $("tabsList");
  list.replaceChildren();
  const visible = allTabs.filter(eligible).slice(0, 10);
  if (!visible.length) {
    const empty = document.createElement("p"); empty.className = "muted small";
    empty.textContent = "No regular web pages in your open tabs yet."; list.append(empty);
  }
  visible.forEach((tab) => {
    const row = document.createElement("div"); row.className = "tab-row";
    const icon = document.createElement("div"); icon.className = "tab-favicon"; icon.textContent = "↗";
    const copy = document.createElement("div"); copy.className = "tab-copy";
    const title = document.createElement("div"); title.className = "tab-title"; title.textContent = tab.title || "Untitled page";
    const domain = document.createElement("div"); domain.className = "tab-domain"; domain.textContent = safeDomain(tab.url);
    copy.append(title, domain);
    const save = document.createElement("button"); save.className = "mini-btn"; save.textContent = "Save";
    save.setAttribute("aria-label", `Save ${tab.title || tab.url}`);
    save.addEventListener("click", () => saveLink(tab.url, tab.title || tab.url));
    row.append(icon, copy, save); list.append(row);
  });
  $("activeLabel").textContent = "Live";
}
async function saveLink(url, title) {
  if (!/^https?:\/\//i.test(url || "")) return notify("Only regular web links can be saved.");
  const vault = await getSaved();
  if (vault.some((item) => item.url === url)) return notify("That link is already in your vault.");
  vault.unshift({ url, title: title || safeDomain(url), savedAt: Date.now() });
  await setSaved(vault); await renderVault(); notify("Saved to your Reading Vault.");
}
async function renderVault() {
  const vault = await getSaved();
  $("savedCount").textContent = `${vault.length} saved`;
  const list = $("vaultList"); list.replaceChildren();
  if (!vault.length) {
    const empty = document.createElement("p"); empty.className = "muted small";
    empty.textContent = "Saved pages will be waiting here."; list.append(empty); return;
  }
  vault.slice(0, 6).forEach((item) => {
    const row = document.createElement("div"); row.className = "vault-row";
    const icon = document.createElement("div"); icon.className = "tab-favicon"; icon.textContent = "↗";
    const copy = document.createElement("div"); copy.className = "tab-copy"; copy.title = "Open saved page";
    const title = document.createElement("div"); title.className = "tab-title"; title.textContent = item.title || "Saved page";
    const domain = document.createElement("div"); domain.className = "tab-domain"; domain.textContent = safeDomain(item.url);
    copy.append(title, domain); copy.addEventListener("click", () => api.tabs.create({ url: item.url }));
    const remove = document.createElement("button"); remove.className = "mini-btn delete-btn"; remove.textContent = "×"; remove.title = "Remove saved link";
    remove.setAttribute("aria-label", `Remove ${item.title || item.url}`);
    remove.addEventListener("click", async () => {
      const latest = await getSaved(); await setSaved(latest.filter((entry) => entry.url !== item.url));
      await renderVault(); notify("Removed from your vault.");
    });
    row.append(icon, copy, remove); list.append(row);
  });
}

$("saveForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = $("urlInput").value.trim();
  const title = $("titleInput").value.trim() || safeDomain(url);
  await saveLink(url, title);
  $("urlInput").value = ""; $("titleInput").value = "";
});
$("saveAllBtn").addEventListener("click", async () => {
  const vault = await getSaved();
  const existing = new Set(vault.map((item) => item.url));
  let added = 0;
  allTabs.filter(eligible).forEach((tab) => {
    if (!existing.has(tab.url)) {
      vault.push({ url: tab.url, title: tab.title || safeDomain(tab.url), savedAt: Date.now() });
      existing.add(tab.url); added++;
    }
  });
  await setSaved(vault); await renderVault(); notify(`Saved ${added} new link${added === 1 ? "" : "s"}.`);
});

function renderTimer() {
  const min = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const sec = (secondsLeft % 60).toString().padStart(2, "0");
  $("timer").textContent = `${min}:${sec}`;
  $("startBtn").textContent = running ? "Pause focus" : (secondsLeft === 0 ? "Start again" : "Start focus");
  $("timerProgress").style.width = `${Math.max(0, Math.min(100, (secondsLeft / SESSION_LENGTH) * 100))}%`;
}
$("startBtn").addEventListener("click", () => {
  if (running) {
    clearInterval(timerHandle); timerHandle = null; running = false;
    $("focusStatus").textContent = "Paused. Pick it up when you’re ready.";
  } else {
    if (secondsLeft === 0) secondsLeft = SESSION_LENGTH;
    running = true;
    $("focusStatus").textContent = "Focus is on. Keep one task in front of you.";
    timerHandle = setInterval(() => {
      secondsLeft = Math.max(0, secondsLeft - 1); renderTimer();
      if (secondsLeft === 0) {
        clearInterval(timerHandle); timerHandle = null; running = false;
        $("focusStatus").textContent = "Session complete — take a short break.";
        notify("Focus session complete. Nice work!"); renderTimer();
      }
    }, 1000);
  }
  renderTimer();
});
$("resetBtn").addEventListener("click", () => {
  clearInterval(timerHandle); timerHandle = null; running = false; secondsLeft = SESSION_LENGTH;
  $("focusStatus").textContent = "Your next 25 minutes are yours."; renderTimer();
});
$("refreshBtn").addEventListener("click", async () => {
  await renderTabs(); await renderVault(); notify("Everything is up to date.");
});

async function updateRamStatus() {
  try {
    const response = await fetch("http://127.0.0.1:5055/metrics", { cache: "no-store" });
    if (!response.ok) throw new Error("RAM metrics unavailable");
    const data = await response.json();
    const mb = Number(data.brave_ram_mb);
    if (!Number.isFinite(mb)) throw new Error("Invalid RAM value");
    $("ramValue").textContent = mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
    $("ramNote").textContent = `Approx. Brave process RAM · ${data.process_count} processes`;
  } catch (error) {
  console.error("RAM error:", error);
  $("ramValue").textContent = "Unavailable";
  $("ramNote").textContent = error.message;
}
}

function updateOnlineStatus() {
  const online = navigator.onLine;
  $("onlineState").textContent = online ? "Online" : "Offline";
  $("onlineState").className = `status-label ${online ? "online" : "offline"}`;
  if (!online) { $("speedNote").textContent = "Check your connection"; }
}
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
async function runSpeedTest() {
  const button = $("speedBtn");
  if (!navigator.onLine) { updateOnlineStatus(); return notify("You appear to be offline."); }
  button.disabled = true; button.textContent = "Testing…";
  $("speedValue").textContent = "…"; $("speedNote").textContent = "Downloading a 1 MB test file";
  try {
    
    const bytes = 1_000_000;
    const url = `https://speed.cloudflare.com/__down?bytes=${bytes}&_=${Date.now()}`;
    const start = performance.now();
    const response = await fetch(url, { cache: "no-store", mode: "cors" });
    if (!response.ok) throw new Error(`Speed test returned ${response.status}`);
    const data = await response.arrayBuffer();
    const elapsedSeconds = (performance.now() - start) / 1000;
    if (!data.byteLength || elapsedSeconds <= 0) throw new Error("No test data received");
    const mbps = (data.byteLength * 8) / elapsedSeconds / 1_000_000;
    $("speedValue").textContent = `${mbps.toFixed(1)} Mbps`;
    $("speedNote").textContent = "Approx. download speed · 1 MB test";
    await api.storage.local.set({ lastSpeedMbps: mbps, lastSpeedAt: Date.now() });
    notify("Speed test complete.");
  } catch (error) {
    $("speedValue").textContent = "Unavailable";
    $("speedNote").textContent = "Could not reach the test server";
    notify("Speed test failed. Check your connection and try again.");
  } finally {
    button.disabled = false; button.innerHTML = 'Test again <span aria-hidden="true">↗</span>';
  }
}
$("speedBtn").addEventListener("click", runSpeedTest);
updateOnlineStatus();

$("insightsBtn").addEventListener("click", async () => {
  const result = $("insightsResult"); result.textContent = "Analyzing locally…";
  const payload = { tabs: allTabs.filter(eligible).map((tab) => ({ title: tab.title || "", url: tab.url })) };
  try {
    const response = await fetch("http://127.0.0.1:5055/analyze", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const data = await response.json(); result.replaceChildren();
    const summary = document.createElement("p");
    summary.textContent = `${data.total_tabs} web tabs · ${data.unique_domains} unique domains · ${data.repeated_domains.length} repeated domains`;
    result.append(summary);
    data.repeated_domains.slice(0, 5).forEach((domain) => {
      const chip = document.createElement("span"); chip.className = "domain-chip";
      chip.textContent = `${domain.domain} ×${domain.count}`; result.append(chip);
    });
    if (!data.repeated_domains.length) {
      const note = document.createElement("p"); note.className = "muted small";
      note.textContent = "No repeated domains in your current tabs."; result.append(note);
    }
    $("apiStatus").textContent = "Connected to the Python service on this Mac.";
  } catch (error) {
    result.textContent = "Python service is offline. Start it using the README instructions, then try again.";
    $("apiStatus").textContent = "Optional local service · the extension works without it.";
  }
});

(async function init() {
  try { await initTheme(); await renderTabs(); await renderVault(); await updateRamStatus(); renderTimer(); }
  catch (error) { console.error("TabGuardian could not initialize", error); notify("Could not load browser data. Try refreshing."); }
})();