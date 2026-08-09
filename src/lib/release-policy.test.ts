// @vitest-environment node

import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import {
	RELEASE_FEATURES,
	RELEASE_HOME_PATH,
	isReleasePathBlocked,
	isReleaseTabVisible,
	releaseApplicationLink,
	type ReleaseTab,
} from './release-policy'

describe('first App Store release policy', () => {
	test('disables Expo Router’s route-listing sitemap', () => {
		const app = JSON.parse(readFileSync(new URL('../../app.json', import.meta.url), 'utf8'))
			.expo as {
			extra?: { router?: { sitemap?: boolean } }
		}
		expect(app.extra?.router?.sitemap).toBe(false)
	})

	test('pins review-sensitive features off until a deliberate release change', () => {
		expect(RELEASE_FEATURES).toEqual({
			filingPreparation: false,
			assistant: true,
			community: false,
			socialLogin: false,
			passwordRecovery: false,
		})
	})

	test('keeps the first-review Resources surface curated and static', () => {
		const resourcesSource = readFileSync(
			new URL('../screens/resources/resources.screen.tsx', import.meta.url),
			'utf8',
		)
		const cronsSource = readFileSync(new URL('../../convex/crons.ts', import.meta.url), 'utf8')

		expect(resourcesSource).not.toMatch(/UscisNews|api\.news|community\.news/)
		expect(cronsSource).toContain('if (releasePolicy.community)')
	})

	test('ships the stable tracker, official resources, assistant, and account tabs', () => {
		const tabs: ReleaseTab[] = [
			'(forms)',
			'cases',
			'resources',
			'assistant',
			'community',
			'account',
		]
		expect(tabs.filter(isReleaseTabVisible)).toEqual(['cases', 'resources', 'assistant', 'account'])
	})

	test.each([
		'/',
		'/renewals',
		'/drafts/',
		'/attention',
		'/completed',
		'/documents',
		'/documents/doc_1',
		'/application/app_1',
		'/application/app_1/review',
		'/new-application?formType=i765#start',
		'/interview/app_1',
		'/account/details',
		'/account/documents/doc_1',
		'/account/settings',
		'/community',
		'/community/post_1',
		'/new-post',
		'/community-rules',
		'/moderation',
		'/_sitemap',
		'/applications',
		'/documents-old',
		'/assistant-tools',
		'/community-support',
		'/forgot-password',
		'/reset-password',
		'/reset-password?token=one-time-token',
		'/new-case/unreviewed',
	])('blocks disabled route %s', (pathname) => {
		expect(isReleasePathBlocked(pathname)).toBe(true)
	})

	test.each([
		'/cases',
		'/cases/case_1',
		'/new-case',
		'/resources',
		'/assistant',
		'/assistant/',
		'/account',
		'/account/privacy',
		'/account/terms',
		'/account/support',
		'/upgrade',
		'/welcome',
		'/sign-in',
		'/cases?next=/documents',
		'/resources#community',
	])('retains stable route %s', (pathname) => {
		expect(isReleasePathBlocked(pathname)).toBe(false)
	})

	test('redirect destination is retained and hidden application links are stripped', () => {
		expect(RELEASE_HOME_PATH).toBe('/cases')
		expect(isReleasePathBlocked(RELEASE_HOME_PATH)).toBe(false)
		expect(releaseApplicationLink('app_1')).toBeUndefined()
		expect(releaseApplicationLink(null)).toBeUndefined()
	})
})
