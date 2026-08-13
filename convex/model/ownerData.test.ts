// @vitest-environment node

import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { OWNER_DATA_TABLES, OWNER_DELETION_PHASES } from './ownerData'

describe('account-deletion inventory', () => {
	test('every non-global schema table is covered by the owner-data contract', () => {
		const schemaSource = readFileSync(new URL('../schema.ts', import.meta.url), 'utf8')
		const schemaTables = [...schemaSource.matchAll(/^\s*(\w+): defineTable\(/gm)].map(
			(match) => match[1]!,
		)
		const globalTables = new Set([
			'newsItems',
			'newsMeta',
			'accountDeletionTombstones',
			'authRateLimits',
		])
		const accountTables = schemaTables.filter((table) => !globalTables.has(table)).sort()

		expect(schemaTables).toContain('accountDeletionTombstones')
		expect([...OWNER_DATA_TABLES].sort()).toEqual(accountTables)
	})

	test('the bounded cascade has an explicit phase for every owned table', () => {
		const tablesByPhase = [
			'documents',
			'applicationDocuments',
			'applicationDrafts',
			'entitlements',
			'cases',
			'applications',
			'applicants',
			'assistantUsage',
			'ownerPreferences',
			'renewalEntries',
			'forumReports',
			'forumComments',
			'forumPosts',
			'communityBlocks',
			'communityProfiles',
		]

		expect(OWNER_DELETION_PHASES).toHaveLength(tablesByPhase.length)
		expect([...OWNER_DATA_TABLES].sort()).toEqual(tablesByPhase.sort())
	})
})
