import { StyledLucideIcon } from '@/components/styled-icon'
import { Card, Separator } from 'heroui-native'
import { Text, View } from 'react-native'

/** A clearly labelled product preview, never a simulated live case or status. */
export function WelcomeCasePreview({ compact }: { compact: boolean }) {
	return (
		<Card className="gap-card rounded-3xl border border-border p-gutter" animation="disable-all">
			<Card.Header className="flex-row items-center justify-between gap-control">
				<View className="flex-1 flex-row items-center gap-tight">
					<StyledLucideIcon name="folder" size={18} className="text-accent" />
					<Text className="flex-1 font-semibold text-sm text-foreground">Your case, organized</Text>
				</View>
				<Text className="text-xs text-muted">Example</Text>
			</Card.Header>
			<Card.Body className="gap-tight">
				<View className="flex-row flex-wrap items-center justify-between gap-tight">
					<Text className="shrink font-display text-xl text-foreground">Work permit</Text>
					<Text className="font-mono text-xs text-muted">FORM I-765</Text>
				</View>
				<View className="gap-hairline">
					<Text className="text-xs text-muted">USCIS receipt number</Text>
					<Text className="font-mono text-sm tracking-wide text-foreground">IOE ••••••••••</Text>
				</View>
			</Card.Body>
			{!compact ? (
				<>
					<Separator />
					<Card.Footer className="flex-row items-center gap-control">
						<View className="size-8 items-center justify-center rounded-full bg-accent/10">
							<StyledLucideIcon name="check" size={16} className="text-accent" />
						</View>
						<View className="flex-1 gap-hairline">
							<Text className="font-medium text-sm text-foreground">Application received</Text>
							<Text className="text-xs text-muted">An update you record from your notice</Text>
						</View>
					</Card.Footer>
				</>
			) : null}
		</Card>
	)
}
