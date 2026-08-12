import { createContext } from 'react'

/** Scoped to one TabIntro so its root ScrollView can repair native geometry
 * after the final acknowledgement commit. */
export const TabIntroTransitionContext = createContext(false)
