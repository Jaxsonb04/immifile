# Store assets

`app-store/6.9-inch/` — working App Store Connect screenshots captured on the
iPhone 16 Pro Max simulator (1320×2868). The current six-image set was approved
and recaptured from the production Release app on August 16, 2026.

The upload sequence is:

1. `01-cases-overview.png` — one clearly synthetic saved case.
2. `02-case-timeline.png` — manual timeline and official status action.
3. `03-assistant-consent.png` — consent or active assistant input.
4. `04-assistant-recommendation.png` — non-sensitive synthetic scenario.
5. `05-resources.png` — official sources and government disclaimer.
6. `06-account.png` — privacy, support, and account deletion.

Keep all content synthetic and set the status bar to the standard 9:41 / full
signal with `xcrun simctl status_bar`. Export 1320×2868 PNG files without an
alpha channel. `store.config.json` owns the ordered `APP_IPHONE_67` screenshot
set; `eas metadata:push` synchronizes it with App Store Connect.
