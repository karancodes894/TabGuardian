# TabGuardian

TabGuardian is a browser extension I built to help manage open tabs and keep useful links in one place. It also includes a focus timer, theme settings, a speed test, and a few browser insights.

Some features work directly in the extension. RAM monitoring and domain analysis need the optional Python backend running on your computer.

## Features

- **Tab management:** View and manage open browser tabs.
- **Reading Vault:** Save links and open them again later.
- **Focus timer:** Use a 25-minute timer for focused work.
- **Theme switcher:** Change the dashboard theme.
- **RAM monitor:** View an approximate RAM reading for Brave processes.
- **Tab analysis:** Count eligible web tabs, find unique domains, and identify repeated domains.
- **Internet speed test:** Estimate download speed using Cloudflare's speed-test endpoint.

## Technologies

- HTML, CSS, and JavaScript
- Chromium extension APIs
- Python 3
- Flask and Flask-CORS
- psutil

## Project structure

```text
tab guardian hour 1/
├── backend/
│   └── app.py
├── extension/
│   ├── background.js
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── requirments.txt
├── README.md
└── TESTING.md
```

## Install in Brave

1. Download the repository from GitHub and extract it.
2. Open `brave://extensions` in Brave.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `extension` folder containing `manifest.json`.
6. Click the TabGuardian icon to open the extension.

## Run the Python backend

The backend is needed for RAM monitoring and tab analysis.

### macOS

Open Terminal in the project folder and run:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r ../requirments.txt
python3 app.py
```

Keep the terminal open while using the backend features.

### Windows

Open Command Prompt in the project folder and run:

```bat
cd backend
py -m venv .venv
.venv\Scripts\activate
py -m pip install -r ..\requirments.txt
py app.py
```

## Check the backend

Open these addresses in your browser after starting the server:

- Health check: `http://127.0.0.1:5055/health`
- RAM metrics: `http://127.0.0.1:5055/metrics`

The health endpoint should return a response with `"status": "ok"`. RAM readings are estimates, so they may not match the exact memory use shown by Activity Monitor.

## Privacy

The Python backend runs on your computer and listens on `127.0.0.1`. Tab analysis sends eligible tab URLs to this local backend for processing. The speed test contacts Cloudflare when you start it. The extension uses browser permissions to access tabs and browser storage to save links and preferences.

## Troubleshooting

**The extension does not load**
- Make sure Developer mode is enabled.
- Select the `extension` folder, not the main project folder.
- Check for errors on `brave://extensions`.

**RAM monitoring is unavailable**
- Start the Python backend.
- Open `http://127.0.0.1:5055/health`.
- If the backend responds, reopen the extension and try again.

**Tab analysis does not work**
- Make sure the backend is running.
- Open a few regular HTTP or HTTPS websites in Brave and try again.

**Python is not found**
- Install Python 3. On macOS, use `python3`; on Windows, try `py`.

## Testing

See [TESTING.md](TESTING.md) for the testing checklist.

## License

This repository does not currently specify a license. Until a license is added, others should not assume they have permission to redistribute or modify the code.