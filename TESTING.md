# TabGuardian — Testing Checklist

Use this checklist to test the extension before submitting the project.

## 1. Setup
- [ ] Load the extension in Brave without errors.
- [ ] Open the popup and check that the dashboard displays correctly.
- [ ] Switch between dark and light themes.
- [ ] Use the refresh button to update the tab list.
- [ ] Start the Python backend.

## 2. Open Tabs
- [ ] Confirm that eligible web tabs appear in the dashboard.
- [ ] Check that the displayed tab count is correct.
- [ ] Save an individual tab to the Reading Vault.
- [ ] Save all eligible tabs and check the result.

## 3. Reading Vault
- [ ] Save a link using the URL form.
- [ ] Confirm saved links remain after reopening the popup.
- [ ] Remove a saved link.
- [ ] Open a saved link successfully.
- [ ] Try saving a duplicate link.

## 4. Focus Timer
- [ ] Start the 25-minute timer.
- [ ] Confirm the displayed time counts down.
- [ ] Reset the timer.
- [ ] Check that the timer reaches its completed state.

## 5. Brave RAM Monitor
- [ ] Start the Python backend.
- [ ] Open `http://127.0.0.1:5055/health` and confirm the service responds.
- [ ] Open `http://127.0.0.1:5055/metrics` and check the returned RAM data.
- [ ] Confirm the popup displays RAM usage.
- [ ] Stop the backend and check that the popup handles the unavailable service.

## 6. Domain Insights
- [ ] Click **Analyze my tabs**.
- [ ] Check the total number of eligible web tabs.
- [ ] Check the number of unique domains.
- [ ] Open multiple tabs from the same domain and check repeated-domain results.
- [ ] Stop the backend and check how the popup handles the error.

## 7. Internet Speed Test
- [ ] Start the speed test.
- [ ] Confirm a result appears when the connection allows it.
- [ ] Check that a failed test is handled gracefully.
- [ ] Confirm the last test result appears in the toolbar tooltip.

## 8. Final Checks
- [ ] Reload the extension after code changes.
- [ ] Test the main features again.
- [ ] Check `brave://extensions` for errors.
- [ ] Confirm the README matches the implemented features.
- [ ] Capture screenshots for the project demonstration.

## Test Results

Date tested: __________

Features working: __________

Problems found: __________

Improvements needed: __________
