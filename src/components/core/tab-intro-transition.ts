import { createContext } from 'react'

/** True when a TabIntro's live content and native chrome are exposed. Root
 * content uses it to defer header ownership and repair native geometry after
 * the final cover-removal commit. */
export const TabIntroTransitionContext = createContext(false)

/** True once the live screen may configure native header geometry. This leads
 * content accessibility during dismissal so UIKit can settle beneath the
 * still-opaque intro cover instead of moving content on the first visible
 * frame. */
export const TabIntroHeaderReadyContext = createContext(false)
