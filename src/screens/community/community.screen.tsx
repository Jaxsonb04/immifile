import { BodyScrollView, ScreenLoading } from '@/components/core'
import { StyledLucideIcon } from '@/components/styled-icon'
import { router } from 'expo-router'
import { Avatar, Button, Surface, Typography } from 'heroui-native'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import {
	commentCountLabel,
	formatRelativeTime,
	handleInitials,
	usePosts,
	type ForumPost,
} from './community.data'
import { CommunityEmpty } from './community.empty'
import { UscisNews } from './community.news'

function PostRow({ post, now }: { post: ForumPost; now: number }) {
	return (
		<Pressable accessibilityRole="button" onPress={() => router.push(`/community/${post._id}`)}>
			<Surface variant="secondary" className="gap-control rounded-2xl p-card">
				<View className="flex-row items-center gap-control">
					<Avatar size="sm" color="accent">
						<Avatar.Fallback>{handleInitials(post.authorHandle)}</Avatar.Fallback>
					</Avatar>
					<Typography.Paragraph className="flex-1 font-medium">
						{post.authorHandle}
					</Typography.Paragraph>
					<Typography.Paragraph color="muted" className="text-xs tabular-nums">
						{formatRelativeTime(post.createdAt, now)}
					</Typography.Paragraph>
				</View>
				<View className="gap-hairline">
					<Typography.Paragraph className="text-base font-semibold leading-snug">
						{post.title}
					</Typography.Paragraph>
					<Typography.Paragraph color="muted" numberOfLines={2} className="text-sm leading-relaxed">
						{post.body}
					</Typography.Paragraph>
				</View>
				<View className="flex-row items-center gap-tight">
					<StyledLucideIcon name="message-circle" size={14} className="text-muted" />
					<Typography.Paragraph color="muted" className="text-xs tabular-nums">
						{commentCountLabel(post.commentCount)}
					</Typography.Paragraph>
				</View>
			</Surface>
		</Pressable>
	)
}

/**
 * Community feed (M4-T2): the paginated, pseudonymous forum. Reading is public —
 * an anonymous session sees everything; writing (via the "+" toolbar and the
 * post detail) is account-gated. Posts are peer support, not legal advice
 * (ADR-0004).
 */
export function CommunityScreen() {
	const { results, status, loadMore } = usePosts()
	const [now] = useState(() => Date.now())

	if (status === 'LoadingFirstPage') return <ScreenLoading />

	// M7-T6: official USCIS news lives in Forum even before the first post —
	// CommunityEmpty leads with it, then a one-screen "start a post" prompt.
	if (results.length === 0) {
		return <CommunityEmpty />
	}

	return (
		<BodyScrollView contentContainerClassName="gap-control py-card">
			{/* M7-T6: official news leads the tab, capped at three items so the
			    peer feed stays within reach. */}
			<UscisNews />
			<View className="gap-hairline px-hairline pt-hairline">
				<Typography.Paragraph color="muted" className="text-center text-xs leading-relaxed">
					Peer support from others going through USCIS renewals — not legal advice.
				</Typography.Paragraph>
				<Pressable
					accessibilityRole="link"
					accessibilityLabel="Read the community rules"
					onPress={() => router.push('/community-rules')}
				>
					<Typography.Paragraph color="muted" className="text-center text-xs font-medium underline">
						Community rules
					</Typography.Paragraph>
				</Pressable>
			</View>
			{results.map((post) => (
				<PostRow key={post._id} post={post} now={now} />
			))}
			{status === 'CanLoadMore' || status === 'LoadingMore' ? (
				<Button variant="ghost" isDisabled={status === 'LoadingMore'} onPress={() => loadMore(20)}>
					<Button.Label>{status === 'LoadingMore' ? 'Loading…' : 'Load more'}</Button.Label>
				</Button>
			) : null}
		</BodyScrollView>
	)
}
