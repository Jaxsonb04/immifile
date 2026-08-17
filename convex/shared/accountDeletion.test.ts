import { describe, expect, test } from 'vitest'
import {
	SOCIAL_DELETION_CHALLENGE_TTL_MS,
	isAccountDeletionAttemptId,
	isSocialDeletionChallengeIdentifier,
	parseSocialDeletionChallenge,
	serializeSocialDeletionChallenge,
	socialDeletionChallengeAuthorizes,
	socialDeletionChallengeIdentifier,
	verifySocialDeletionOAuthAccountUpdate,
	type SocialDeletionChallenge,
} from './accountDeletion'

const CREATED_AT = 1_800_000_000_000
const challenge: SocialDeletionChallenge = {
	version: 1,
	userId: 'better-auth-user',
	ownerId: 'https://deployment.convex.site|better-auth-user',
	sessionId: 'better-auth-session',
	provider: 'google',
	providerAccountId: 'original-google-sub',
	providerAccountUpdatedAt: CREATED_AT - 1_000,
	createdAt: CREATED_AT,
}

test('accepts only canonical UUIDv4 deletion receipt capabilities', () => {
	expect(isAccountDeletionAttemptId('123e4567-e89b-42d3-a456-426614174000')).toBe(true)
	expect(isAccountDeletionAttemptId('123e4567-e89b-12d3-a456-426614174000')).toBe(false)
	expect(isAccountDeletionAttemptId('123e4567-e89b-42d3-7456-426614174000')).toBe(false)
	expect(isAccountDeletionAttemptId('not-a-capability')).toBe(false)
})

describe('social account-deletion challenge', () => {
	test('uses a deterministic opaque identifier and round-trips strict data', async () => {
		const identifier = await socialDeletionChallengeIdentifier(
			challenge.userId,
			challenge.sessionId,
			challenge.provider,
		)
		expect(isSocialDeletionChallengeIdentifier(identifier)).toBe(true)
		expect(identifier).not.toContain(challenge.userId)
		expect(identifier).not.toContain(challenge.sessionId)
		expect(parseSocialDeletionChallenge(serializeSocialDeletionChallenge(challenge))).toEqual(
			challenge,
		)
		expect(parseSocialDeletionChallenge('{}')).toBeNull()
	})

	test('marks proof only for the exact original user/provider account update', () => {
		const verified = verifySocialDeletionOAuthAccountUpdate(
			challenge,
			{ link: { userId: challenge.userId } },
			{
				userId: challenge.userId,
				providerId: challenge.provider,
				accountId: challenge.providerAccountId,
				updatedAt: new Date(CREATED_AT + 1_000),
			},
			CREATED_AT + 1_000,
		)
		expect(verified).toEqual({ ...challenge, verifiedAt: CREATED_AT + 1_000 })
	})

	test.each([
		['wrong signed-link user', { link: { userId: 'other-user' } }, {}],
		['no signed-link state', {}, {}],
		['wrong Better Auth user', { link: { userId: challenge.userId } }, { userId: 'other-user' }],
		['wrong provider', { link: { userId: challenge.userId } }, { providerId: 'apple' }],
		[
			'different chooser account',
			{ link: { userId: challenge.userId } },
			{ accountId: 'foreign-google-sub' },
		],
		[
			'unchanged account record',
			{ link: { userId: challenge.userId } },
			{ updatedAt: challenge.providerAccountUpdatedAt },
		],
	] as const)('rejects %s', (_label, oauthState, accountOverrides) => {
		expect(
			verifySocialDeletionOAuthAccountUpdate(
				challenge,
				oauthState,
				{
					userId: challenge.userId,
					providerId: challenge.provider,
					accountId: challenge.providerAccountId,
					updatedAt: CREATED_AT + 1_000,
					...accountOverrides,
				},
				CREATED_AT + 1_000,
			),
		).toBeNull()
	})

	test('binds final authorization to user, owner, session, proof, and TTL', () => {
		const verified = { ...challenge, verifiedAt: CREATED_AT + 1_000 }
		const identity = {
			userId: challenge.userId,
			ownerId: challenge.ownerId,
			sessionId: challenge.sessionId,
		}
		expect(socialDeletionChallengeAuthorizes(verified, identity, CREATED_AT + 2_000)).toBe(true)
		expect(
			socialDeletionChallengeAuthorizes(
				verified,
				{ ...identity, sessionId: 'stolen-other-session' },
				CREATED_AT + 2_000,
			),
		).toBe(false)
		expect(
			socialDeletionChallengeAuthorizes(
				verified,
				identity,
				CREATED_AT + SOCIAL_DELETION_CHALLENGE_TTL_MS + 1,
			),
		).toBe(false)
	})
})
