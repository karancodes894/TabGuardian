# TabGuardian 🛡️

**Your browser, under control.**

TabGuardian is a privacy-first browser extension designed to help users manage browser tabs, save useful links, stay focused, and monitor browser activity.

## ✨ Features

- **Tab Manager:** View and manage open browser tabs.
- **Reading Vault:** Save useful links for later.
- **Focus Timer:** Stay focused during study and coding sessions.
- **Theme Switcher:** Switch between dashboard themes.
- **Brave RAM Monitor:** View approximate RAM usage of Brave processes.
- **Domain Insights:** Analyze open tabs and identify repeated domains.
- **Internet Speed Test:** Estimate your internet download speed.

## 🛠️ Built With

- HTML
- CSS
- JavaScript
- Python
- Flask
- psutil
- Brave Browser Extension APIs

## 📁 Project Structure

```text
tab guardian hour 1/
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── backend/
│   ├── app.py
│   └── .venv/
├── requirements.txt
├── README.md
└── TESTING.md
```

## 🚀 Installation and Setup

### 1. Requirements

Install Python 3 and use the Brave browser.

### 2. Install Python dependencies

Open the terminal in the main project folder and run:

```bash
cd backend
source .venv/bin/activate
pip install -r ../requirements.txt
```

### 3. Start the backend

From the `backend` folder, run:

```bash
python app.py
```

The local service is expected to run at `http://127.0.0.1:5000`.

### 4. Load the extension

1. Open `brave://extensions` in Brave.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `extension` folder containing `manifest.json`.
5. Click the extension icon to open TabGuardian.

## 🔒 Privacy

TabGuardian is designed to keep its local Python service on your computer. RAM figures are approximate because shared process memory may be counted more than once. Internet speed testing requires an internet connection.

## 🧪 Testing

See [TESTING.md](TESTING.md) for the testing checklist.

## 🐛 Troubleshooting

- **Extension fails to load:** Select the `extension` folder, not the main project folder or `backend` folder.
- **RAM shows Unavailable:** Make sure the Python service is running and visit `http://127.0.0.1:5000/metrics` in your browser.
- **Domain Insights doesn't work:** Check that the backend provides the `/analyze` endpoint.
- **Port 5000 is occupied:** Check which process is using the port before stopping it.

## 🎯 Project Goal

TabGuardian aims to make everyday browsing more organized, productive, and privacy-conscious.
