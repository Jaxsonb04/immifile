import { useEffect } from 'react'
import { Text, View } from 'react-native'
import Animated, {
	cancelAnimation,
	Easing,
	ReduceMotion,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated'

/**
 * Welcome-screen signature illustration — "SHEET OF RECORD".
 *
 * WHAT IT DRAWS. Not a picture of paper: paper. One full-bleed sheet of warm
 * ruled notice stock, cropped by the phone on three sides — off the left edge,
 * off the right edge, and up off the top under the status bar — so no corner
 * and no radius is ever visible. It has exactly one edge you can see, the
 * bottom one, and that edge is a perforation: the sheet simply stops, thirty-one
 * uncut paper ligaments bridge the seam, and the tear-off stub below has worked
 * half a degree out of true. A horizontal crease runs across the upper third
 * (this notice arrived folded, in an envelope) and the vertical margin rule
 * JOGS 1.5pt sideways where it crosses that crease, because the panel above the
 * fold is a different plane of paper sitting slightly out of register. On the
 * ruled field: a small tracked label, and under it, set flush to the margin, the
 * anatomy of a USCIS receipt number — 3 letters (service center) · 2 digits
 * (fiscal year) · 3 digits (computer workday) · 5 digits (case sequence).
 *
 * THE ONE TERRACOTTA MOMENT. The first eight characters are set in ink. The last
 * five — the case sequence, the only part of that string that belongs to this
 * person rather than to everyone who filed at the same center in the same week —
 * are NOT set. Those five character cells are EMPTY, and the paper's pale ruling
 * beneath them thickens into five cobalt underscores, one per missing glyph.
 * That is the entire accent budget for this illustration and it is a proposition,
 * not a decoration: this is the part that is yours, and we are holding the space.
 * Continue's fill is the screen's second accent and the Privacy policy link is
 * the third. Net accent on welcome stays at three.
 *
 * WHY IT LOOKS NOTHING LIKE THE TAB EMPTY STATES. Frozen at thumbnail size,
 * `CaseTrackingHero` is a small isolated object surrounded by emptiness — a
 * rounded card floating over a soft ellipse above a three-stop rail. This is a
 * FILLED FIELD with a hard bottom edge and a strong left axis: no closed shape,
 * no rounded corner, no floating object, no ground shadow, no rail, no envelope,
 * no badge, no skeleton bars, no Lucide glyph, nothing centred, nothing tilted
 * two degrees. Its marks are 26pt type, 11pt type, and eleven hairlines. The two
 * pictures do not converge at any size.
 *
 * INVARIANTS — do not "polish" any of these away.
 *
 *  1. THE STRING IS A FORMAT, NEVER A RECORD. The last five characters must stay
 *     BLANK. A fully-set thirteen-character receipt number on the first screen of
 *     an app that is not affiliated with USCIS, DHS, DOJ or the U.S. government
 *     is an exposure and it is also a worse picture — eight glyphs plus five warm
 *     blanks is a composition, thirteen glyphs is a slab. The label says YOUR
 *     receipt number for the same reason: the field is the user's, not the
 *     agency's. Equally: do NOT "solve" this by replacing the digits with tick
 *     marks — that puts the empty-state skeleton-bar vocabulary straight back in
 *     and forfeits the entire escape.
 *
 *  2. NO INSTITUTIONAL ICONOGRAPHY, NO OUTCOME. No seals, eagles, shields,
 *     flags, wordmarks, form numbers or status words. Nothing here completes,
 *     approves, predicts or accelerates anything. The blank ruled lines below
 *     the number are the subject: one line of the record is written, the rest is
 *     not, and this app is not going to pretend otherwise.
 *
 *  3. THE ACCENT IS NEVER FADED. The five cobalt underscores are revealed by
 *     occlusion — each rules itself in from behind its own `overflow-hidden`
 *     mask — never by opacity, so the app's one reserved hue is either absent or
 *     completely itself. There is no `opacity: v` anywhere in this file where `v`
 *     starts at 0; every cap lives in the base term.
 *
 *  4. THE NUMBER RISES OUT OF THE RULE, IT IS NEVER PRESSED ONTO IT. Each glyph
 *     is clipped at the baseline and translates UP into view. That is the exact
 *     opposite gesture from a stamp coming down, and the opposite of anything
 *     being done TO this person. No `withSpring`, no overshoot, no recoil, ever.
 *
 *  5. THE SHEET NEVER FLOATS, NEVER TILTS AND NEVER DRIFTS. Total ambient travel
 *     anywhere in this frame is about half a point. Paper on a desk is still, and
 *     this is the screen about waiting; it should be the calmest thing in the app.
 *     It WILL read as "not animating" to a casual glance. That is the design and
 *     the direct antidote to the family's four-loop float — do not "fix" it by
 *     reintroducing a float, a -2° tilt or a ground shadow. If it genuinely tests
 *     as inert, the only sanctioned amplification is widening the fold valley's
 *     opacity range.
 *
 *  6. STRUCTURE CARRIES THE READ, NOT TONE. `bg-surface` on `bg-background` is a
 *     2% lightness step in light mode and may be invisible on a dim panel. The
 *     things that actually prove there is a sheet are border-tone and survive
 *     zero tonal contrast: the doubled bottom edge, the border-tone perforation
 *     seam interrupted by paper bridges, the out-of-register stub, the crease and
 *     the margin-rule jog. If light mode reads weak on real glass, deepen those —
 *     never add a shadow, never hardcode a colour.
 *
 *  7. THE FOLD VALLEY IS DRIVEN FROM `bg-foreground` AT LOW ALPHA, deliberately.
 *     `bg-surface-secondary` inverts between themes (oklch 94% in light, 24.5% in
 *     dark — brighter than `surface`), which would turn the crease's shadow into
 *     a highlight. Low-alpha `bg-foreground` is the house idiom (five shipped
 *     heroes use it for their ground shadow) and reads as a valley in light and a
 *     faint warm bloom in dark, which is what this dark theme wants anyway.
 *
 *  8. BOTTOM-ANCHORED, ALWAYS. Every y in this file is measured from the hero's
 *     BOTTOM edge. The perforation and the stub are what make this a sheet rather
 *     than a card, and a top-anchored layout would clip exactly those two marks
 *     first on a short band (e.g. a 812pt iPhone mini, where welcome's `compact`
 *     is still false). The sheet is the element designed to run off the top.
 *
 * MOTION CONTRACT. Transform + opacity only — never width, height, top, left,
 * margin, padding, borderRadius or fontSize. One linear master clock plus two
 * idle loops on non-harmonic periods. Every reveal is `overflow-hidden` plus a
 * translate (the one reveal proven in this repo); `transformOrigin` is
 * deliberately not used. Every `.value =` write is inside a `useEffect` — the
 * React Compiler rejects writes during render. Under Reduce Motion the clock is
 * pinned at ENTRANCE_MS and both loops stay at 0, and the resulting first frame
 * IS the finished composition, byte-identical to what a motion user sees at
 * t = 1620ms.
 *
 * CALL SITE. `<SheetOfRecordHero height={compact ? 190 : 288} />`. The
 * component sets `alignSelf: 'stretch'` on its own root, so it goes full-bleed
 * inside welcome's existing `flex-1 items-center justify-end pt-safe` parent with
 * NO edit to welcome.tsx. It also bleeds `TOP_BLEED` past its own top so the
 * paper runs under the status bar on its own; welcome's `ScrollView` is the clip
 * boundary. Dropping `pt-safe` from that parent is a strictly stronger pose (the
 * clock and battery printed on warm stock) but is a product decision — verify on
 * a notched device, a Dynamic Island device and Android before taking it.
 */

/** Master clock length. Every beat below ends at or before this. */
const ENTRANCE_MS = 1840

/**
 * Local 0→1 progress of one beat, eased out-cubic. `now` is in MILLISECONDS so
 * every call site reads as a real timing: `seg(clock.value, 340, 490)`.
 */
function seg(now: number, from: number, to: number): number {
	'worklet'
	const x = Math.min(1, Math.max(0, (now - from) / (to - from)))
	return 1 - (1 - x) * (1 - x) * (1 - x)
}

/**
 * The clock every entrance beat reads from. `Easing.linear` is MANDATORY and
 * must stay explicit: `withTiming`'s default is `Easing.inOut(Easing.quad)`, and
 * omitting it would silently warp every millisecond in this file — the 60ms
 * hitch before the five cobalt underscores would disappear and the rhythm
 * would collapse into a generic ease. All shaping lives in `seg`.
 *
 * Rest convention here is INVERTED relative to `useIdleLoop`: the clock rests at
 * ENTRANCE_MS (loops rest at 0), so entrance terms are always written
 * `k * (1 - seg(...))` and the pattern is visually obvious.
 */
function useArrivalClock(enabled: boolean) {
	const clock = useSharedValue(enabled ? 0 : ENTRANCE_MS)
	useEffect(() => {
		if (!enabled) {
			clock.value = ENTRANCE_MS
			return
		}
		clock.value = withTiming(ENTRANCE_MS, {
			duration: ENTRANCE_MS,
			easing: Easing.linear,
			reduceMotion: ReduceMotion.System,
		})
		return () => cancelAnimation(clock)
	}, [enabled, clock])
	return clock
}

/** Ping-pong a shared value 0→1 forever on its own slow period. House idiom. */
function useIdleLoop(duration: number, enabled: boolean) {
	const value = useSharedValue(0)
	useEffect(() => {
		if (!enabled) {
			value.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.cubic) })
			return
		}
		value.value = withRepeat(
			withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
			-1,
			true,
		)
		return () => cancelAnimation(value)
	}, [duration, enabled, value])
	return value
}

/**
 * The master clock's type, derived without importing `SharedValue` so this file
 * keeps to the imports the design system sanctions.
 */
type Clock = ReturnType<typeof useSharedValue<number>>

/**
 * How far Inter's baseline sits above the BOTTOM of an explicit line box.
 *
 * React Native centres the font's natural line (hhea ascender 0.969em +
 * descender 0.242em = 1.211em) inside whatever `lineHeight` you give it, so the
 * baseline lands at `lineHeight / 2 - 0.3635 * fontSize` above the box bottom.
 * Every glyph mask in this file is exactly that much SHORTER than its line box
 * and holds its Text at `bottom: -baselineDrop(...)`, which puts the mask's
 * clipping edge precisely on the baseline — so a glyph translating up rises out
 * of the ruled line the way handwriting sits on lined paper, and never pokes out
 * below it.
 *
 * THIS IS THE ONE NUMBER IN THE FILE THAT NEEDS A DEVICE ITERATION. The beat is
 * the whole design; budget one screenshot round at both breakpoints. Android is
 * handled by `includeFontPadding: false` on every Text below; if it still sits
 * high or low there, nudge the 0.3635 rather than moving any `bottom`.
 */
function baselineDrop(fontSize: number, lineHeight: number): number {
	return lineHeight / 2 - fontSize * 0.3635
}

/**
 * One character cell of the receipt number.
 *
 * A child component so each cell owns its own `useAnimatedStyle` — the
 * fixed-length-array rule constrains hooks written INSIDE one component, and
 * per-instance hooks are the sanctioned escape. The cells are fixed-width and
 * the glyph is centred in its cell, because `tabular-nums` normalises FIGURES
 * only: Inter's I / O / E have advances of roughly 0.28 / 0.73 / 0.57em and
 * would never align on their own. Fixed cells also make every downstream width
 * (the inked field, the cobalt run) exactly computable with no measurement.
 */
type GlyphCellProps = {
	clock: Clock
	char: string
	/** The millisecond the key is struck. */
	at: number
	cellW: number
	maskH: number
	fontSize: number
	lineHeight: number
	drop: number
}

function GlyphCell({ clock, char, at, cellW, maskH, fontSize, lineHeight, drop }: GlyphCellProps) {
	// A struck character does not slide, fade or grow — it is simply there on
	// the next frame. The step is deliberate: it is what separates typing from
	// a reveal, and it means ink is never composited at partial opacity. All of
	// the liveness lives in the caret and in the cadence between strikes.
	const style = useAnimatedStyle(() => ({ opacity: clock.value >= at ? 1 : 0 }))
	return (
		<View className="overflow-hidden" style={{ width: cellW, height: maskH }}>
			<Animated.Text
				maxFontSizeMultiplier={1}
				className="text-center font-mono tabular-nums text-foreground"
				style={[
					{
						position: 'absolute',
						left: 0,
						bottom: -drop,
						width: cellW,
						fontSize,
						lineHeight,
						includeFontPadding: false,
					},
					style,
				]}
			>
				{char}
			</Animated.Text>
		</View>
	)
}

/**
 * The insertion caret.
 *
 * It appears on the empty field, advances one cell per struck character, and
 * comes to rest on the FIRST case-sequence cell — the first character that
 * would be the viewer's own — where it blinks. That resting position is the
 * whole point of the screen stated in one 2pt mark: everything the agency
 * writes is already filled in, and what is left is yours.
 *
 * The blink is a square wave (a real caret does not fade), derived by
 * thresholding a slow ping-pong so it needs no extra timing machinery. Under
 * Reduce Motion the loop rests at 0, which reads as ON: the caret is solid and
 * parked on its final cell, and that IS the finished composition.
 */
type CaretProps = {
	clock: Clock
	blink: Clock
	/** translateX for cells 0..8; index 8 is the first case-sequence cell. */
	offsets: readonly number[]
	/** The strike time of each character; the caret advances past each one. */
	times: readonly number[]
	/** When the caret first appears, and when it stops moving and starts blinking. */
	appearAt: number
	restAt: number
	width: number
	height: number
	left: number
	bottom: number
}

function Caret({
	clock,
	blink,
	offsets,
	times,
	appearAt,
	restAt,
	width,
	height,
	left,
	bottom,
}: CaretProps) {
	const style = useAnimatedStyle(() => {
		const now = clock.value
		let cell = 0
		for (let i = 0; i < times.length; i += 1) {
			if (now >= times[i]) cell = i + 1
		}
		const x = offsets[cell < offsets.length ? cell : offsets.length - 1]
		let opacity = 0
		if (now >= appearAt) {
			opacity = now < restAt ? 1 : blink.value < 0.5 ? 1 : 0
		}
		return { opacity, transform: [{ translateX: x }] }
	})
	return (
		<Animated.View
			className="bg-foreground"
			style={[{ position: 'absolute', left, bottom, width, height }, style]}
		/>
	)
}

/**
 * One of the five cobalt underscores under the empty case-sequence cells.
 *
 * Revealed by occlusion (invariant 3), never by opacity. Square ends and 3pt
 * tall on purpose: `rounded-full` at `h-2.5` is the tab empty states' accent
 * primitive and must not reappear here.
 */
type AccentRuleProps = {
	clock: Clock
	from: number
	to: number
	width: number
	height: number
}

function AccentRule({ clock, from, to, width, height }: AccentRuleProps) {
	const style = useAnimatedStyle(() => ({
		transform: [{ translateX: -width * (1 - seg(clock.value, from, to)) }],
	}))
	return (
		<View className="overflow-hidden" style={{ width, height }}>
			<Animated.View className="bg-accent" style={[{ width, height }, style]} />
		</View>
	)
}

/**
 * The eight set characters, in the receipt number's real four-group anatomy.
 * Groups one to three arrive as WHOLE UNITS — you read "IOE" as a word, not as
 * three letters — which is why the three cells of a group share one timing.
 * The 30ms silences between groups are the hitch that stops this reading as a
 * progress bar. This array is FIXED-LENGTH; do not generate it.
 */
const GLYPHS: readonly { char: string; group: 0 | 1 | 2; at: number }[] = [
	{ char: 'I', group: 0, at: 280 },
	{ char: 'O', group: 0, at: 372 },
	{ char: 'E', group: 0, at: 456 },
	{ char: '2', group: 1, at: 600 },
	{ char: '6', group: 1, at: 684 },
	{ char: '1', group: 2, at: 828 },
	{ char: '9', group: 2, at: 912 },
	{ char: '0', group: 2, at: 992 },
]

/** Strike times alone, for the caret. Derived so the two can never drift. */
const STRIKES: readonly number[] = GLYPHS.map((glyph) => glyph.at)

/** The caret appears just before the first strike and rests after the last. */
const CARET_IN = 200
const CARET_REST = 1050

/**
 * The five case-sequence underscores. The 60ms silence between the inked field
 * finishing (1080) and the first of these (1140) is the longest pause in the
 * entrance and it sits immediately before the part that is theirs.
 */
const ACCENT_BEATS: readonly { from: number; to: number }[] = [
	{ from: 1340, to: 1470 },
	{ from: 1384, to: 1514 },
	{ from: 1428, to: 1558 },
	{ from: 1472, to: 1602 },
	{ from: 1516, to: 1646 },
]

/** Horizontal overhang past each screen edge. Guarantees no vertical edge ever
 *  becomes visible, including as the stub rotates. */
const BLEED = 24

/** Vertical overhang past the hero's own top. Deliberately larger than any
 *  plausible leftover flex space plus safe-area inset, so the sheet reaches the
 *  status bar on every device; welcome's ScrollView is the clip boundary. */
const TOP_BLEED = 240

type SheetOfRecordHeroProps = {
	/**
	 * Height of the hero band in points. EVERY dimension in this composition —
	 * the ruling pitch, the type size, the character cell, the perforation, the
	 * stub — derives from this and nothing else. The hero takes the full width of
	 * whatever it is placed in (`alignSelf: 'stretch'`) and bleeds past it.
	 * 190 = iPhone-SE class (welcome's `compact`); 288 = every other device.
	 */
	height?: number
}

export function SheetOfRecordHero({ height = 288 }: SheetOfRecordHeroProps) {
	const reduceMotion = useReducedMotion()
	const animated = !reduceMotion

	const clock = useArrivalClock(animated)
	// Two loops, non-harmonic, both deliberately sub-perceptual (invariant 5).
	const breath = useIdleLoop(7400, animated)
	const flex = useIdleLoop(6800, animated)
	// Thresholded to a square wave in `Caret` — a caret blinks, it does not fade.
	const blink = useIdleLoop(560, animated)

	const compact = height < 240

	// ── Vertical skeleton, measured from the BOTTOM edge (invariant 8) ────────
	const stubFB = 10
	const stubH = compact ? 16 : 20
	const seamFB = stubFB + stubH
	const pitch = compact ? 30 : 36
	const seamGap = compact ? 32 : 40
	const ruleCount = compact ? 3 : 5
	const rules = Array.from({ length: ruleCount }, (_, i) => seamFB + seamGap + i * pitch)
	// Regular: blank · blank · NUMBER · LABEL · blank. Compact drops the two
	// outer blanks. The blank rule ABOVE the label is what proves the ruling is
	// infinite while the entry is finite — it is not spare, keep it on regular.
	const numberFB = rules[compact ? 1 : 2]
	const labelFB = rules[compact ? 2 : 3]
	const creaseFB = rules[ruleCount - 1] + seamGap

	// ── Horizontal skeleton ──────────────────────────────────────────────────
	const marginX = compact ? 30 : 34
	const textX = compact ? 42 : 46
	const cellW = compact ? 19 : 22
	const groupGap = compact ? 8 : 9
	const fontSize = compact ? 22 : 26
	const lineHeight = Math.round(fontSize * 1.08)
	const drop = baselineDrop(fontSize, lineHeight)
	const maskH = lineHeight - drop
	// Eight set characters plus the two interior group gaps. The inked field is
	// exactly this wide, which is the whole reason the cells are fixed-width.
	const inkW = 8 * cellW + 2 * groupGap

	// Caret geometry. `left` is cell 0; every later cell is reached by
	// translateX, so the caret is one View that moves rather than nine that
	// toggle. Group gaps are folded into the offsets, which is why this is a
	// table and not `i * cellW`.
	const caretW = 2
	const caretH = Math.round(fontSize * 0.92)
	const caretLeft = textX + (cellW - caretW) / 2
	const caretOffsets = [
		0 * cellW,
		1 * cellW,
		2 * cellW,
		3 * cellW + groupGap,
		4 * cellW + groupGap,
		5 * cellW + 2 * groupGap,
		6 * cellW + 2 * groupGap,
		7 * cellW + 2 * groupGap,
		8 * cellW + 3 * groupGap,
	]
	const accentX = textX + inkW + groupGap
	const accentW = cellW - 4
	const accentH = 3

	const labelSize = compact ? 10 : 11
	const labelLineHeight = Math.round(labelSize * 1.28)
	const labelDrop = baselineDrop(labelSize, labelLineHeight)
	const labelMaskH = labelLineHeight - labelDrop
	// Generous fixed box: the occluder needs a known width and the wipe must
	// clear the longest plausible rendering of the label. Never measured.
	const labelW = compact ? 156 : 182

	// Tuned so the perforation pitch lands near 15pt on BOTH breakpoints
	// (393 + 2·BLEED and 375 + 2·BLEED); `space-between` does the rest, so the
	// seam fills any width with no measurement and the end bridges fall off
	// screen inside the bleed.
	const bridgeCount = compact ? 29 : 31
	const bridgeW = 7
	const bridgeH = 8

	// ── Motion ───────────────────────────────────────────────────────────────

	// The fold panel is a SEPARATE PLANE of paper. It settles down-and-right into
	// register and rests permanently 1.5pt out of true, which is what breaks the
	// margin rule into two offset segments where the crease crosses it. That 1.5pt
	// jog is the best detail in the composition — 1.0pt sits under the perceptual
	// floor at 3x, so it must not be reduced.
	const foldStyle = useAnimatedStyle(() => {
		const jog = 1.5 + 2.1 * (1 - seg(clock.value, 0, 620)) + 0.4 * breath.value
		return { transform: [{ translateX: jog }, { translateY: jog }] }
	})

	// The crease deepens and shallows. 0.86 is a CAP in the base term, not a
	// fade-in target: the valley is fully present under Reduce Motion.
	const valleyStyle = useAnimatedStyle(() => ({
		opacity: 0.86 + 0.14 * (1 - seg(clock.value, 0, 620)) - 0.16 * breath.value,
	}))

	// The label uncovers left-to-right: an occluder in the sheet's own colour
	// retracts rightward inside an `overflow-hidden` box. No fade, no measurement.
	const labelStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: labelW * seg(clock.value, 180, 320) }],
	}))

	// THE FIELD IS INKED. 230ms — the slowest single beat of the entrance, a
	// deliberate unhurried line. The paper's own pale ruling does not draw; a
	// darker, FINITE segment of it appears along the number's length. A value has
	// been entered on a line that was already there.
	const fieldStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: -inkW * (1 - seg(clock.value, 1060, 1290)) }],
	}))

	// The tear-off works loose. Last beat, slowest, barely visible; the
	// composition finishes by going slightly out of true. The rotation opens the
	// perforation seam into a wedge — narrow at the left, roughly four times as
	// wide at the right — because the band is far wider than the screen.
	const stubStyle = useAnimatedStyle(() => {
		const settle = seg(clock.value, 1600, 1840)
		return {
			transform: [
				{ translateY: (3.4 + 0.6 * flex.value) * settle },
				{ rotate: `${(0.55 + 0.15 * flex.value) * settle}deg` },
			],
		}
	})

	return (
		<View
			accessible={false}
			importantForAccessibility="no-hide-descendants"
			style={{ height, alignSelf: 'stretch' }}
		>
			{/* ── The sheet ────────────────────────────────────────────────────
			    Full bleed on three sides. No corner, no radius, no shadow. */}
			<View
				className="bg-surface"
				style={{
					position: 'absolute',
					left: -BLEED,
					right: -BLEED,
					top: -TOP_BLEED,
					bottom: seamFB,
				}}
			/>

			{/* ── The ruling ───────────────────────────────────────────────────
			    Ruled paper. Not a rail: nothing sits on these, nothing travels
			    along them, there are no stops and there never may be. */}
			{rules.map((fb) => (
				<View
					key={fb}
					className="bg-separator"
					style={{ position: 'absolute', left: -BLEED, right: -BLEED, bottom: fb, height: 1 }}
				/>
			))}

			{/* Fainter second hairline under the crease. */}
			<View
				className="bg-separator"
				style={{
					position: 'absolute',
					left: -BLEED,
					right: -BLEED,
					bottom: creaseFB - 2.5,
					height: 1,
				}}
			/>

			{/* ── The margin rule, lower segment ───────────────────────────────
			    Runs from under the fold panel down to the perforation and stops.
			    Everything on this sheet hangs off it, left-ranged, while the
			    Libre Franklin headline below is centred. That is the asymmetry. */}
			<View
				className="bg-border"
				style={{ position: 'absolute', left: marginX, width: 1, top: 0, bottom: seamFB }}
			/>

			{/* ── The inked field ──────────────────────────────────────────────
			    A darker, finite segment laid over the pale infinite ruling,
			    exactly as wide as the eight characters it pins. */}
			<View
				className="overflow-hidden"
				style={{ position: 'absolute', left: textX, bottom: numberFB, width: inkW, height: 1 }}
			>
				<Animated.View className="bg-border" style={[{ width: inkW, height: 1 }, fieldStyle]} />
			</View>

			{/* ── THE ONE TERRACOTTA MOMENT ────────────────────────────────────
			    Five underscores, one per unwritten character of the case
			    sequence. See invariants 1 and 3. */}
			<View
				style={{
					position: 'absolute',
					left: accentX,
					bottom: numberFB - (accentH - 1),
					flexDirection: 'row',
				}}
			>
				{ACCENT_BEATS.map((beat) => (
					<View key={beat.from} style={{ width: cellW }} className="items-center">
						<AccentRule
							clock={clock}
							from={beat.from}
							to={beat.to}
							width={accentW}
							height={accentH}
						/>
					</View>
				))}
			</View>

			{/* ── The number ───────────────────────────────────────────────────
			    Baseline on the rule; each glyph clipped at that baseline and
			    rising out of it (invariant 4). */}
			<View
				style={{
					position: 'absolute',
					left: textX,
					bottom: numberFB + 1,
					flexDirection: 'row',
					gap: groupGap,
				}}
			>
				{([0, 1, 2] as const).map((group) => (
					<View key={group} className="flex-row">
						{GLYPHS.filter((glyph) => glyph.group === group).map((glyph) => (
							<GlyphCell
								key={glyph.char + glyph.at}
								clock={clock}
								char={glyph.char}
								at={glyph.at}
								cellW={cellW}
								maskH={maskH}
								fontSize={fontSize}
								lineHeight={lineHeight}
								drop={drop}
							/>
						))}
					</View>
				))}
			</View>

			{/* ── The caret ────────────────────────────────────────────────────
			    Advances one cell per strike, then parks on the first
			    case-sequence cell and blinks. See the Caret block comment. */}
			<Caret
				clock={clock}
				blink={blink}
				offsets={caretOffsets}
				times={STRIKES}
				appearAt={CARET_IN}
				restAt={CARET_REST}
				width={caretW}
				height={caretH}
				left={caretLeft}
				bottom={numberFB + 1}
			/>

			{/* ── The label ────────────────────────────────────────────────────
			    "YOUR" is load-bearing: it frames the field as the user's rather
			    than the agency's. See invariant 1. */}
			<View
				className="overflow-hidden"
				style={{
					position: 'absolute',
					left: textX,
					bottom: labelFB + 1,
					width: labelW,
					height: labelMaskH,
				}}
			>
				<Text
					numberOfLines={1}
					maxFontSizeMultiplier={1}
					className="font-semibold text-muted"
					style={{
						position: 'absolute',
						left: 0,
						bottom: -labelDrop,
						width: labelW,
						fontSize: labelSize,
						lineHeight: labelLineHeight,
						letterSpacing: compact ? 1.5 : 1.7,
						includeFontPadding: false,
					}}
				>
					YOUR RECEIPT NUMBER
				</Text>
				<Animated.View
					className="bg-surface"
					style={[{ position: 'absolute', top: 0, bottom: 0, left: 0, width: labelW }, labelStyle]}
				/>
			</View>

			{/* ── The fold ─────────────────────────────────────────────────────
			    A separate plane of paper: it carries its own segment of the
			    margin rule, and because it rests out of register that rule jogs
			    where the two planes meet. */}
			<Animated.View
				style={[
					{ position: 'absolute', left: -BLEED, right: -BLEED, top: -TOP_BLEED, bottom: creaseFB },
					foldStyle,
				]}
				className="bg-surface"
			>
				<View
					className="bg-border"
					style={{ position: 'absolute', left: BLEED + marginX, width: 1, top: 0, bottom: 0 }}
				/>
				{/* The valley of the crease, as a four-step tonal ramp rather than
				    a gradient. Driven from `bg-foreground` — see invariant 7. */}
				<Animated.View
					style={[{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }, valleyStyle]}
				>
					<View
						className="bg-foreground"
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 4,
							height: 3,
							opacity: 0.045,
						}}
					/>
					<View
						className="bg-foreground"
						style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 2, opacity: 0.08 }}
					/>
					<View
						className="bg-foreground"
						style={{ position: 'absolute', left: 0, right: 0, bottom: 1, height: 1, opacity: 0.13 }}
					/>
				</Animated.View>
				<View
					className="bg-border"
					style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1 }}
				/>
			</Animated.View>

			{/* ── The perforation ──────────────────────────────────────────────
			    The seam is drawn in BORDER tone, not as background showing
			    through a 2% step, so it survives light mode on a dim panel
			    (invariant 6). The bridges are the uncut ligaments that hold a
			    tear-off stub on; the dashes are the gaps between them. */}
			<View
				className="bg-border"
				style={{ position: 'absolute', left: -BLEED, right: -BLEED, bottom: seamFB, height: 1 }}
			/>

			{/* ── The stub ─────────────────────────────────────────────────────
			    Doubled bottom edge: the true end of the paper, and a fainter
			    hairline under it. This is the sheet's only visible edge. */}
			<Animated.View
				className="bg-surface"
				style={[
					{ position: 'absolute', left: -BLEED, right: -BLEED, bottom: stubFB, height: stubH },
					stubStyle,
				]}
			>
				<View
					className="bg-border"
					style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1 }}
				/>
				<View
					className="bg-separator"
					style={{ position: 'absolute', left: 0, right: 0, bottom: -2.5, height: 1 }}
				/>
			</Animated.View>

			{/* Bridges last: they are paper laid ACROSS the seam and the stub, and
			    they must interrupt the border-tone seam rather than sit under it.
			    `space-between` fills whatever width the device gives us — no
			    measurement, and the end bridges land off-screen inside the bleed. */}
			<View
				style={{
					position: 'absolute',
					left: -BLEED,
					right: -BLEED,
					bottom: seamFB - (bridgeH - 2),
					height: bridgeH,
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				{Array.from({ length: bridgeCount }, (_, i) => (
					<View key={i} className="bg-surface" style={{ width: bridgeW, height: bridgeH }} />
				))}
			</View>
		</View>
	)
}

export default SheetOfRecordHero
