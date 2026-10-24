
const api = globalThis.browser || globalThis.chrome;


const METRICS_URL = "http://127.0.0.1:5055/metrics";

async function updateToolbarStatus() {
  let ramText = "RAM unavailable";

  try {
    const response = await fetch(METRICS_URL, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Metrics service unavailable");
    }

    const metrics = await response.json();
    const mb = metrics.brave_ram_mb;

    if (!Number.isFinite(mb) || mb < 0) {
      throw new Error("Invalid RAM value");
    }

    ramText = mb >= 1024
      ? `${(mb / 1024).toFixed(1)} GB`
      : `${Math.round(mb)} MB`;

    const badge = mb >= 1024
      ? `${(mb / 1024).toFixed(1)}G`
      : `${Math.round(mb)}M`;

    await api.action.setBadgeText({
      text: badge.slice(0, 4)
    });

    await api.action.setBadgeBackgroundColor({
      color: "#9BEF62"
    });

    if (api.action.setBadgeTextColor) {
      await api.action.setBadgeTextColor({
        color: "#14200D"
      });
    }
  } catch {
    ramText = "RAM unavailable";

    await api.action.setBadgeText({
      text: "RAM?"
    });

    await api.action.setBadgeBackgroundColor({
      color: "#6B7280"
    });
  }

  const stored = await api.storage.local.get({
    lastSpeedMbps: null,
    lastSpeedAt: null
  });

  const speedText = Number.isFinite(stored.lastSpeedMbps)
    ? `${stored.lastSpeedMbps.toFixed(1)} Mbps (last tested)`
    : "not tested yet";

  await api.action.setTitle({
    title: `TabGuardian · Brave RAM: ${ramText} · Download speed: ${speedText}. Click for dashboard.`
  });
}

api.alarms.create("tabguardian-metrics", {
  periodInMinutes: 1
});

api.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "tabguardian-metrics") {
    updateToolbarStatus();
  }
});

api.runtime.onInstalled.addListener(updateToolbarStatus);
api.runtime.onStartup.addListener(updateToolbarStatus);

api.storage.onChanged.addListener((changes, area) => {
  if (
    area === "local" &&
    (changes.lastSpeedMbps || changes.lastSpeedAt)
  ) {
    updateToolbarStatus();
  }
});

updateToolbarStatus();
