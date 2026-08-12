import { ResetPasswordScreen } from '@/screens/auth'
import { PASSWORD_RECOVERY_ENABLED } from '@/lib/password-recovery'
import { Redirect } from 'expo-router'

export default function ResetPasswordRoute() {
	if (!PASSWORD_RECOVERY_ENABLED) return <Redirect href="/welcome" />
	return <ResetPasswordScreen />
}
