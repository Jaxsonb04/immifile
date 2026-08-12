# SocialAuthButton

A specialised Button that renders a provider-specific icon alongside a label for social login flows.

## Import

```tsx
import { SocialAuthButton } from 'heroui-native-pro';
```

## Usage

### Basic usage

Pass a `provider` to render the corresponding icon and default label.

```tsx
<SocialAuthButton provider="google" />
```

### Custom label

Override the default label with the `label` prop.

```tsx
<SocialAuthButton provider="apple" label="Sign in with Apple" />

<SocialAuthButton provider="github" label="Login via GitHub" />
```

### Multiple providers

Stack multiple SocialAuthButtons for a social login form.

```tsx
<View className="gap-3">
  <SocialAuthButton provider="facebook" label="Continue with Facebook" />
  <SocialAuthButton provider="apple" label="Continue with Apple" />
  <SocialAuthButton provider="google" label="Continue with Google" />
</View>
```

### Side-by-side layout

Display compact icon-only buttons in a row.

```tsx
<View className="flex-row gap-3">
  <SocialAuthButton provider="apple" className="flex-1" />
  <SocialAuthButton provider="google" className="flex-1" />
</View>
```

### Custom icon props

Customise the icon size or color with `iconProps`.

```tsx
<SocialAuthButton provider="discord" iconProps={{ size: 24 }} />

<SocialAuthButton
  provider="slack"
  iconProps={{ colorClassName: "accent-foreground" }}
/>
```

### Custom children

Replace the default icon and label entirely with custom children.

```tsx
<SocialAuthButton provider="google">
  <MyCustomGoogleIcon />
  <Button.Label>Google SSO</Button.Label>
</SocialAuthButton>
```

### All providers

The component supports 11 built-in providers.

```tsx
<SocialAuthButton provider="google" />
<SocialAuthButton provider="apple" />
<SocialAuthButton provider="github" />
<SocialAuthButton provider="facebook" />
<SocialAuthButton provider="x" />
<SocialAuthButton provider="microsoft" />
<SocialAuthButton provider="discord" />
<SocialAuthButton provider="linkedin" />
<SocialAuthButton provider="slack" />
<SocialAuthButton provider="notion" />
<SocialAuthButton provider="linear" />
```

## Example

```tsx
import { Separator } from 'heroui-native';
import { SocialAuthButton } from 'heroui-native-pro';
import { Text, View } from 'react-native';

export default function SocialLoginForm() {
  return (
    <View className="px-5 py-6 gap-6">
      <View className="items-center gap-1">
        <Text className="text-xl font-semibold text-foreground">
          Sign in to Acme Co
        </Text>
        <Text className="text-sm text-muted">
          Welcome back! Please sign in to continue
        </Text>
      </View>

      <View className="flex-row gap-3">
        <SocialAuthButton provider="apple" className="flex-1" />
        <SocialAuthButton provider="google" className="flex-1" />
      </View>

      <View className="flex-row items-center gap-3">
        <Separator className="flex-1" />
        <Text className="text-sm text-muted">or</Text>
        <Separator className="flex-1" />
      </View>
    </View>
  );
}
```

## API Reference

### SocialAuthButton

Defaults to `variant="outline"`. Extends all [Button](https://heroui.com/docs/native/components/button#button) props.

| prop       | type                        | default | description                                                        |
| ---------- | --------------------------- | ------- | ------------------------------------------------------------------ |
| `children` | `React.ReactNode`           | -       | Custom children replacing the default icon and label               |
| `provider` | `SocialAuthButtonProvider`  | -       | OAuth / social-login provider determining which icon and label are rendered |
| `iconProps`| `SocialAuthButtonIconProps`  | -       | Props forwarded to the provider icon component                     |
| `label`    | `string`                    | -       | Custom label text. When omitted the default provider label is used |

#### SocialAuthButtonProvider

| value         | description         |
| ------------- | ------------------- |
| `"google"`    | Google login        |
| `"apple"`     | Apple login         |
| `"github"`    | GitHub login        |
| `"facebook"`  | Facebook login      |
| `"x"`         | X (Twitter) login   |
| `"microsoft"` | Microsoft login     |
| `"discord"`   | Discord login       |
| `"linkedin"`  | LinkedIn login      |
| `"slack"`     | Slack login         |
| `"notion"`    | Notion login        |
| `"linear"`    | Linear login        |

#### SocialAuthButtonIconProps

| prop             | type     | default              | description                                               |
| ---------------- | -------- | -------------------- | --------------------------------------------------------- |
| `size`           | `number` | `18`                 | Size of the icon in pixels                                |
| `color`          | `string` | -                    | Color of the icon fill                                    |
| `colorClassName` | `string` | `"accent-foreground"` | Uniwind class name mapped to the icon color              |
