import { api } from '@convex/_generated/api'
import { useQuery } from 'convex/react'
import * as WebBrowser from 'expo-web-browser'
import { Surface, Typography } from 'heroui-native'
import { Badge } from 'heroui-native-pro/badge'
import { Widget } from 'heroui-native-pro/widget'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { styledIcon } from '@/components/styled-icon'

import { formatRelativeTime } from './community.format'

const NewspaperIcon = styledIcon({ family: 'lucide', name: 'newspaper' })
const ExternalLinkIcon = styledIcon({ family: 'lucide', name: 'external-link' })

// M5-T2, re-homed to the Community tab in M7-T6 and restyled with the Pro
// Widget in the Community rebrand: a compact official-news briefing above the
// peer feed. Everything rendered here comes from the server-side cache in
// convex/news.ts, which only ever stores https://www.uscis.gov/ links — this
// component adds no other sources.

const NEWSROOM_URL = 'https://www.uscis.gov/newsroom'
const MAX_VISIBLE_ITEMS = 3

function openOfficialLink(url: string) {
	void WebBrowser.openBrowserAsync(url)
}

/** Empty-cache fallback: a single link-out to the official newsroom. */
function NewsroomLinkRow() {
	return (
		<Pressable accessibilityRole="link" onPress={() => openOfficialLink(NEWSROOM_URL)}>
			<Surface variant="secondary" className="flex-row items-center gap-control rounded-2xl p-card">
				<NewspaperIcon size={18} className="text-muted" />
				<Typography.Paragraph color="muted" className="flex-1 text-sm">
					Read the latest at uscis.gov/newsroom
				</Typography.Paragraph>
				<ExternalLinkIcon size={13} className="text-muted" />
			</Surface>
		</Pressable>
	)
}

/**
 * "Latest from USCIS" — up to three cached official items, presented as a Pro
 * `Widget`: the source and an "Official" trust badge in the header, the
 * headlines in the Widget's elevated content card, and any staleness in the
 * footer. Loading renders nothing; an empty cache renders the newsroom
 * link-out.
 *
 * `maxItems` lets the caller trim the list — the empty Community screen shows
 * it as a fixed, non-scrolling header, so on short devices it drops to two
 * items to leave room for the "Start a post" prompt below it.
 */
export function UscisNews({ maxItems = MAX_VISIBLE_ITEMS }: { maxItems?: number } = {}) {
	const news = useQuery(api.news.latestNews, {})
	// Snapshotted once per mount, like the community screens — relative times
	// here are day-granularity, so drift within a session is invisible.
	const [now] = useState(() => Date.now())
	if (news === undefined) return null
	if (news.items.length === 0) return <NewsroomLinkRow />

	const items = news.items.slice(0, Math.max(1, maxItems))

	return (
		<Widget>
			<Widget.Header>
				<View className="gap-hairline">
					<Widget.Title className="text-base">Latest from USCIS</Widget.Title>
					<Widget.Description className="text-xs">Direct from uscis.gov</Widget.Description>
				</View>
				<Badge variant="soft" color="success" size="sm">
					Official
				</Badge>
			</Widget.Header>
			<Widget.Content className="overflow-hidden p-0">
				{items.map((item, index) => (
					<Pressable
						key={item.url}
						accessibilityRole="link"
						onPress={() => openOfficialLink(item.url)}
						className="active:opacity-70"
					>
						<View
							className={`flex-row items-center gap-control px-card py-control ${index > 0 ? 'border-t border-separator' : ''}`}
						>
							<View className="flex-1 gap-hairline">
								<Typography.Paragraph
									numberOfLines={2}
									className="text-sm font-medium leading-snug"
								>
									{item.title}
								</Typography.Paragraph>
								<Typography.Paragraph color="muted" className="text-xs">
									{formatRelativeTime(item.publishedAt, now)}
								</Typography.Paragraph>
							</View>
							<ExternalLinkIcon size={14} className="text-muted" />
						</View>
					</Pressable>
				))}
			</Widget.Content>
			{news.isStale && news.fetchedAt !== null ? (
				<Widget.Footer>
					<Widget.Description className="text-xs">
						Updated {formatRelativeTime(news.fetchedAt, now)} · may be out of date
					</Widget.Description>
				</Widget.Footer>
			) : null}
		</Widget>
	)
}
