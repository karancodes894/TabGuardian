from collections import Counter
from urllib.parse import urlparse
from flask import Flask, request, jsonify
from flask_cors import CORS
import psutil

app = Flask(__name__)
# The server binds to loopback only; CORS permits the browser extension to call it.
CORS(app, resources={r"/*": {"origins": "*"}})

@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "TabGuardian Python insights"})

@app.get("/metrics")
def metrics():
    """Return an approximate RAM estimate for Brave processes on this Mac.

    RSS is summed across matching processes; shared memory can be counted more
    than once, so this is an estimate rather than an exact physical-memory figure.
    """
    total_rss = 0
    matched = 0
    for proc in psutil.process_iter(["name", "cmdline", "memory_info"]):
        try:
            name = (proc.info.get("name") or "").lower()
            cmdline = " ".join(proc.info.get("cmdline") or []).lower()
            if "brave browser" in name or "brave browser" in cmdline:
                info = proc.info.get("memory_info")
                if info is not None:
                    total_rss += info.rss
                    matched += 1
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue
    return jsonify({
        "brave_ram_mb": round(total_rss / (1024 * 1024), 1),
        "process_count": matched,
        "measurement": "approximate summed process RSS; shared memory may be counted more than once"
    })

@app.post("/analyze")
def analyze():
    body = request.get_json(silent=True) or {}
    tabs = body.get("tabs", [])
    domains = []
    for tab in tabs:
        url = str(tab.get("url", ""))
        parsed = urlparse(url)
        if parsed.scheme in ("http", "https") and parsed.hostname:
            domains.append(parsed.hostname.lower().removeprefix("www."))
    counts = Counter(domains)
    repeated = [
        {"domain": domain, "count": count}
        for domain, count in counts.most_common()
        if count > 1
    ]
    return jsonify({
        "total_tabs": len(domains),
        "unique_domains": len(counts),
        "repeated_domains": repeated,
        "tip": "Consider grouping tabs from the same domain into one focused workspace."
    })

if __name__ == "__main__":
    # Bind to loopback only: this API is intended for your own Mac.
    app.run(host="127.0.0.1", port=5055, debug=False)
