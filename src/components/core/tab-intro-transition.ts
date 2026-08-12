import { createContext } from 'react'

/** True when a TabIntro's live content and native chrome are exposed. Root
 * content uses it to defer header ownership and repair native geometry after
 * the final cover-removal commit. */
export const TabIntroTransitionContext = createContext(false)
