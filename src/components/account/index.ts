// Public surface of the account module — the contextual account gate (ADR-0010),
// the full-screen upgrade surface, and the viewer identity hook (M6-T1).
// Consumers import only from here: sensitive actions await `useRequireAccount()`,
// the shipping app presents the `/upgrade` modal route,
// renders `UpgradeScreen`, and personalized copy reads `useViewer()`. The gate
// store, bottom sheet, upgrade actions, invested-progress recap, and raw
// session hook stay internal to the module.
export { AccountGateProvider } from './account.context'
export { useRequireAccount } from './account.require-account'
export { useAccountSession } from './account.session'
export { TempAccountCard, TempAccountDeletionBanner } from './account.temp-banner'
export { useViewer } from './account.viewer'
export { UpgradeScreen } from './upgrade'
export type { InvestedProgress } from './account.data'
