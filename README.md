# TabGuardian 🛡️

**Your browser, under control.**

TabGuardian is a privacy-focused browser extension that helps you organize tabs, save useful links, stay focused, monitor Brave browser RAM usage, and understand your browsing activity.

## ✨ Features

- **Tab Manager** — View, search, switch between, and close open tabs.
- **Reading Vault** — Save useful links for later and reopen them whenever you need them.
- **Focus Timer** — Use a 25-minute focus session to stay productive.
- **Theme Switcher** — Customize the dashboard appearance.
- **Brave RAM Monitor** — View approximate RAM usage of Brave browser processes.
- **Analyze My Tabs** — Count web tabs, identify unique domains, and find repeated domains.
- **Internet Speed Test** — Estimate download speed using Cloudflare's speed test endpoint.
- **Local Python Backend** — Provides RAM metrics and domain analysis from your own computer.

## 🧰 Built With

- HTML
- CSS
- JavaScript
- Brave/Chromium Extension APIs
- Python 3
- Flask
- Flask-CORS
- psutil

## 📁 Project Structure

```text
TabGuardian-main/
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── backend/
│   └── app.py
├── requirments.txt
├── README.md
└── TESTING.md
```

## 🚀 Installation

### Step 1: Download TabGuardian

1. Open this GitHub repository.
2. Click the green **Code** button.
3. Select **Download ZIP**.
4. Extract the downloaded ZIP file.

### Step 2: Install the browser extension

1. Open the Brave browser.
2. Visit `brave://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `extension` folder containing `manifest.json`.
6. Click the TabGuardian icon to open the dashboard.

**Important:** Select the `extension` folder, not the main project folder.

The extension's tab management, Reading Vault, focus timer, theme switcher, and other browser-side features can work without the Python backend.

## 🐍 Enable RAM Monitoring and Analyze My Tabs

RAM monitoring and Analyze My Tabs require the local Python backend to be installed and running on your computer.

### Requirements

- Python 3
- Brave browser
- Internet connection for installing Python dependencies

### macOS and Linux

Open Terminal in the extracted `TabGuardian-main` project folder and run these commands one at a time:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r ../requirments.txt
python3 app.py
```

Keep the Terminal window open while using the Python-powered features.

### Windows

Open Command Prompt in the extracted `TabGuardian-main` project folder and run:

```bat
cd backend
py -m venv .venv
.venv\Scripts\activate
py -m pip install -r ..\requirments.txt
py app.py
```

Keep the Command Prompt window open while using the Python-powered features.

### Verify the backend

Once the server starts, open the following address in your browser:

`http://127.0.0.1:5055/health`

A successful response contains:

```json
{
  "status": "ok",
  "service": "TabGuardian Python insights"
}
```

You can also check RAM metrics at:

`http://127.0.0.1:5055/metrics`

This endpoint returns an approximate RAM measurement for Brave browser processes.

After starting the backend, return to TabGuardian and test **RAM Monitoring** and **Analyze My Tabs**.

## 🔒 Privacy

- TabGuardian's Python backend listens on your own computer at `127.0.0.1`.
- RAM measurements and domain analysis are processed locally by the backend.
- The backend does not intentionally transmit your tab list to a remote analysis service.
- The internet speed test sends a request to Cloudflare when you manually start the test.
- RAM figures are approximate because shared memory may be counted more than once.

The extension also uses browser permissions to access and manage tabs, and local browser storage to save preferences and Reading Vault links.

## 🛠️ Troubleshooting

### Extension does not load

- Open `brave://extensions`.
- Confirm Developer mode is enabled.
- Select the `extension` folder containing `manifest.json`.
- Check the error details displayed by Brave.

### RAM usage shows Unavailable

1. Start the Python backend using the instructions above.
2. Open `http://127.0.0.1:5055/health`.
3. Confirm that the response contains `"status": "ok"`.
4. Open `http://127.0.0.1:5055/metrics` to check RAM data.
5. Return to TabGuardian and refresh or reopen the dashboard.

### Analyze My Tabs does not work

1. Make sure the Python backend is running.
2. Open several ordinary web pages in Brave.
3. Return to TabGuardian.
4. Click **Analyze My Tabs** again.

The analysis counts eligible HTTP and HTTPS tabs. Browser-internal pages are excluded.

### Python or pip command is not found

Install Python 3 and make sure it is available in your system PATH. On macOS, use `python3` and `python3 -m pip`. On Windows, try `py` and `py -m pip`.

### Dependency installation fails

Make sure you are in the `backend` folder before running the dependency installation command. The dependency file in this repository is currently named `requirments.txt`.

### Port 5055 is already in use

Another process may already be using port 5055. Check whether an existing TabGuardian backend is running before starting another instance.

## 🧪 Testing

See [TESTING.md](TESTING.md) for the project testing checklist.

Before sharing a release, verify that:

- The extension loads successfully.
- Tab management and Reading Vault work.
- The focus timer and theme switcher work.
- RAM metrics are returned by the backend.
- Analyze My Tabs identifies repeated domains correctly.
- The internet speed test handles connection failures.
- The setup instructions work on a fresh installation.

## 🎯 Project Goal

TabGuardian aims to make everyday browsing more organized, productive, and privacy-conscious through a simple browser dashboard.

## 👨‍💻 Contributing

Suggestions, bug reports, and improvements are welcome. Test changes carefully and preserve existing working features.

## 📄 License

Add your chosen open-source license before distributing TabGuardian publicly. Until a license is added, do not assume that others have permission to redistribute or modify the project.
