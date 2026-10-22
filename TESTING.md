# TabGuardian — Testing Checklist

Use this checklist to test the extension before your HackClub Carnival submission.

## 1. Setup
- [ ] Extension loads in Brave without errors.
- [ ] Dashboard opens correctly.
- [ ] Theme switcher works.
- [ ] Refresh button updates the tab list.
- [ ] Python backend starts successfully.

## 2. Tab Manager
- [ ] Open tabs appear in the dashboard.
- [ ] Tab count matches the browser.
- [ ] Search works by title or domain.
- [ ] Clicking a tab opens or switches to it.
- [ ] Closing a tab updates the count.

## 3. Reading Vault
- [ ] Save a link.
- [ ] Saved links remain after reopening the popup.
- [ ] Remove a saved link.
- [ ] Open a saved link successfully.

## 4. Focus Timer
- [ ] Start the timer.
- [ ] Pause and resume the timer.
- [ ] Reset the timer.
- [ ] Confirm the display updates correctly.

## 5. Brave RAM Monitor
- [ ] Start the Python backend.
- [ ] Open `http://127.0.0.1:5055/metrics`.
- [ ] Confirm the endpoint returns RAM data.
- [ ] Confirm the dashboard displays RAM usage.
- [ ] Stop the backend and check that the dashboard handles the unavailable service.

## 6. Domain Insights
- [ ] Click Analyze My Tabs.
- [ ] Confirm the number of tabs is displayed.
- [ ] Confirm unique domains are counted.
- [ ] Open multiple tabs from the same domain and check repeated-domain results.

## 7. Internet Speed Test
- [ ] Start the speed test.
- [ ] Confirm a result appears.
- [ ] Retry after a failed connection.
- [ ] Confirm the interface handles network errors.

## 8. Final Checks
- [ ] Reload the extension after code changes.
- [ ] Test the main features again.
- [ ] Fix any errors shown in `brave://extensions`.
- [ ] Capture screenshots for the project demonstration.

## Test Results

Date tested: __________

Features working: __________

Problems found: __________

Improvements needed: __________
