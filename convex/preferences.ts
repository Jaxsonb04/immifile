import { v } from 'convex/values'
import { literals } from 'convex-helpers/validators'
import { mutation, query } from './_generated/server'
import { requireOwnerId } from './lib/auth'

// M6-T6: per-owner boolean UI flags. The key set is a closed allowlist so
// clients can't grow unbounded junk rows; add new literals as features need
// them. Stored server-side so flags survive reinstalls and carry over when an
// anonymous session converts (model/ownerData.ts moves them on link).
// M7-T5 added the per-tab intro flags (one one-time intro per primary tab).
const preferenceKey = literals(
	'formsIntroDismissed',
	'casesIntroDismissed',
	'forumIntroDismissed',
	'accountIntroDismissed',
	'resourcesIntroDismissed',
	'assistantIntroDismissed',
)

export const getPreference = query({
	args: { key: preferenceKey },
	returns: v.boolean(),
	handler: async (ctx, args) => {
		const ownerId = await requireOwnerId(ctx)
		const row = await ctx.db
			.query('ownerPreferences')
			.withIndex('by_ownerId_and_key', (q) => q.eq('ownerId', ownerId).eq('key', args.key))
			.unique()
		return row?.value ?? false
	},
})

export const setPreference = mutation({
	args: { key: preferenceKey, value: v.boolean() },
	handler: async (ctx, args) => {
		const ownerId = await requireOwnerId(ctx)
		const row = await ctx.db
			.query('ownerPreferences')
			.withIndex('by_ownerId_and_key', (q) => q.eq('ownerId', ownerId).eq('key', args.key))
			.unique()
		if (row === null) {
			await ctx.db.insert('ownerPreferences', {
				ownerId,
				key: args.key,
				value: args.value,
				updatedAt: Date.now(),
			})
		} else {
			await ctx.db.patch('ownerPreferences', row._id, { value: args.value, updatedAt: Date.now() })
		}
		return null
	},
})
