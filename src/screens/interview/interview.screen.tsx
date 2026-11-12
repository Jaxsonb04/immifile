import { useAppForm } from '@/components/form'
import type { Id } from '@convex/_generated/dataModel'
import { useRouter } from 'expo-router'
import { Button, Spinner, Typography } from 'heroui-native'
import { useState } from 'react'
import { Alert, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { Interview } from './interview'
import type { InterviewState } from './interview.context'
import {
	useApplicationDetail,
	useSaveApplicationStep,
	type ApplicationDetail,
} from './interview.data'
import {
	initialStepIndex,
	interviewFormOptions,
	seedFromDraft,
	stepDescriptorsFor,
	type InterviewFieldPath,
} from './interview.form'

/**
 * The interview host (ADR-0013): ONE `useAppForm` instance and a host-owned
 * visible-step index, swapping step bodies rather than routes. Every Next
 * validates the step's fields, persists via the idempotent
 * `saveApplicationStep`, then advances — no autosave (docs/internal/REARCHITECTURE.md
 * "Save Semantics"). Closing mid-step keeps everything already saved by
 * earlier Nexts and drops only the current step's unsaved edits, by design.
 *
 * ADR-0013 mechanics note: the installed @tanstack/react-form@1.33 ships a
 * FormGroup API that predates the multi-step-wizard example the ADR tracked,
 * so per the ADR's own fallback clause, Next gates on `validateField` over
 * the step's field paths instead of FormGroup/onGroupSubmit. The
 * load-bearing decisions — single form instance, host-owned step index,
 * withForm step consumers — are unchanged.
 */
export function InterviewScreen(props: {
	applicationId: Id<'applications'>
	// When set (from the review screen's Edit affordance), the wizard opens on
	// this step and, in single mode, returns to review after saving it.
	startStepKey?: string
	singleStep?: boolean
}) {
	const router = useRouter()
	const detail = useApplicationDetail(props.applicationId)

	if (detail === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Spinner />
			</View>
		)
	}

	if (detail === null) {
		return (
			<View className="flex-1 items-center justify-center gap-card bg-background px-gutter">
				<Typography.Paragraph color="muted" className="text-center">
					This application no longer exists.
				</Typography.Paragraph>
				<Button variant="secondary" onPress={() => router.back()}>
					<Button.Label>Go back</Button.Label>
				</Button>
			</View>
		)
	}

	if (detail.application.status !== 'draft') {
		return (
			<View className="flex-1 items-center justify-center gap-card bg-background px-gutter">
				<Typography.Paragraph color="muted" className="text-center">
					This application has been filed — its answers can no longer be edited.
				</Typography.Paragraph>
				<Button variant="secondary" onPress={() => router.back()}>
					<Button.Label>Close</Button.Label>
				</Button>
			</View>
		)
	}

	// Mounted only once the draft is loaded so the form seeds exactly once.
	return (
		<Wizard
			applicationId={props.applicationId}
			detail={detail}
			startStepKey={props.startStepKey}
			singleStep={props.singleStep ?? false}
		/>
	)
}

function Wizard(props: {
	applicationId: Id<'applications'>
	detail: ApplicationDetail
	startStepKey?: string
	singleStep: boolean
}) {
	const router = useRouter()
	const saveStep = useSaveApplicationStep()
	const { application, draft } = props.detail

	const steps = stepDescriptorsFor(application.formType)
	const [index, setIndex] = useState(() =>
		// initialStepIndex already resolves a key→index with a safe -1→0 fallback,
		// so a single-step edit opens directly on its target step.
		initialStepIndex(application.formType, props.startStepKey ?? application.currentStepKey),
	)
	const [saving, setSaving] = useState(false)

	const form = useAppForm({
		...interviewFormOptions,
		defaultValues: seedFromDraft(draft.answers),
	})

	const step = steps[index]!
	const isLast = index === steps.length - 1

	async function validateStep(fieldPaths: readonly InterviewFieldPath[]): Promise<boolean> {
		let valid = true
		for (const path of fieldPaths) {
			form.setFieldMeta(path, (meta) => ({ ...meta, isTouched: true }))
			await form.validateField(path, 'submit')
			const errors = form.getFieldMeta(path)?.errors ?? []
			if (errors.length > 0) valid = false
		}
		return valid
	}

	async function handleNext(): Promise<void> {
		if (saving) return
		if (!(await validateStep(step.fieldPaths))) return
		setSaving(true)
		try {
			await saveStep({
				applicationId: props.applicationId,
				stepKey: step.key,
				stepData: step.buildStepData(form.state.values, application.applicationKind),
			})
			if (props.singleStep) {
				// Single-step edit from the review screen: return to review (which
				// pushed us) instead of advancing. The review summary re-renders
				// reactively from the live getApplication query — inspect→edit→recheck.
				router.back()
			} else if (isLast) {
				// All pre-Review steps saved; the server has promoted person-facts
				// (ADR-0014) and the Journey Hub now shows "Answers complete".
				router.back()
			} else {
				setIndex(index + 1)
			}
		} catch (error) {
			Alert.alert(
				"Couldn't save this step",
				error instanceof Error ? error.message : 'Please try again.',
			)
		} finally {
			setSaving(false)
		}
	}

	const state: InterviewState = {
		application,
		step,
		stepNumber: index + 1,
		totalSteps: steps.length,
		saving,
		isLast,
		singleStep: props.singleStep,
		next: () => void handleNext(),
		// In single-step mode Back cancels straight to review (never walks the
		// earlier steps); otherwise it steps back or closes from the first step.
		back: () => (props.singleStep || index === 0 ? router.back() : setIndex(index - 1)),
		close: () => router.back(),
	}

	return (
		<Interview.Provider state={state}>
			<View className="flex-1 bg-background">
				<Interview.Header />
				<KeyboardAwareScrollView
					contentContainerClassName="gap-gutter px-gutter pt-card pb-section"
					keyboardShouldPersistTaps="handled"
				>
					<Interview.Question />
					<Interview.StepFields form={form} />
				</KeyboardAwareScrollView>
				<Interview.Footer />
			</View>
		</Interview.Provider>
	)
}
