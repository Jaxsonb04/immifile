# NumberValue

A formatted number display with locale-aware rendering for currency, percentages, and compact notation.

## Import

```tsx
import { NumberValue } from 'heroui-native-pro';
```

## Anatomy

```tsx
<NumberValue value={1234.56}>
  <NumberValue.Prefix>approx </NumberValue.Prefix>
  <NumberValue.Value />
  <NumberValue.Suffix> users</NumberValue.Suffix>
</NumberValue>
```

- **NumberValue**: Root `View` (laid out in a row with baseline alignment) that reads a numeric `value`, resolves the format options, and exposes the formatted string through context. When no children are provided, the root auto-renders `NumberValue.Value`. A render-function `children` is also supported for fully custom output (no wrapping container is rendered in that case).
- **NumberValue.Value**: Renders the formatted numeric string from the root context as a `Text`. Use this part to place the value explicitly when composing a custom layout around it.
- **NumberValue.Prefix**: Inline `Text` rendered before the value (e.g. a leading label or unit symbol).
- **NumberValue.Suffix**: Inline `Text` rendered after the value (e.g. a trailing label or unit symbol).

## Full `Intl.NumberFormat` compatibility

`NumberValue` relies on the runtime's built-in `Intl.NumberFormat`. On most modern React Native runtimes (Hermes with Intl enabled, or JSC on iOS) basic formatting — decimals, currency, percent, `signDisplay: "auto"` — works out of the box **without any polyfill**.

However, some advanced options are not available on every platform / JS engine version and require the [FormatJS](https://formatjs.github.io/) polyfills to behave identically to the web. If you plan to use any of the following, install the polyfills:

- `notation: "compact"` (e.g. `1.2K`, `3.4M`)
- `notation: "scientific"` / `"engineering"`
- `signDisplay: "always" | "exceptZero" | "never" | "negative"`
- `style: "unit"` (e.g. `kilometer-per-hour`)
- `currencyDisplay: "name"`, `currencySign: "accounting"`
- Non-default locales (anything other than the runtime's default, e.g. `de-DE`, `ja-JP`, `fr-FR`)
- Consistent behaviour across iOS, Android, and old Hermes builds

### Installation

```bash
yarn add @formatjs/intl-getcanonicallocales @formatjs/intl-locale @formatjs/intl-numberformat @formatjs/intl-pluralrules
```

### Import order

The polyfills must be imported **at the very top of your app's entry file** (e.g. `App.tsx`, `_layout.tsx`, `index.js`) and in **exactly this order** — each polyfill depends on the previous ones being loaded first.

```tsx
import '@formatjs/intl-getcanonicallocales/polyfill-force';
import '@formatjs/intl-locale/polyfill-force';

import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/polyfill-force';

import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/polyfill-force';
```

### Adding more locales

Each locale's data must be imported explicitly — the polyfills do not ship all locales by default to keep the bundle small. To support additional locales, add a `locale-data` import for every locale you want, for **both** `intl-numberformat` and `intl-pluralrules`:

```tsx
import '@formatjs/intl-getcanonicallocales/polyfill-force';
import '@formatjs/intl-locale/polyfill-force';

import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/locale-data/de';
import '@formatjs/intl-numberformat/locale-data/fr';
import '@formatjs/intl-numberformat/locale-data/ja';
import '@formatjs/intl-numberformat/polyfill-force';

import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/de';
import '@formatjs/intl-pluralrules/locale-data/fr';
import '@formatjs/intl-pluralrules/locale-data/ja';
import '@formatjs/intl-pluralrules/polyfill-force';
```

> The `locale-data` imports must always come **before** the corresponding `polyfill-force` import of the same package. Only load the locales you actually use — every locale adds to the JS bundle size.

If you pass `locale="xx-XX"` as a prop but the matching locale data has not been imported, the polyfill silently falls back to the default locale, producing incorrect formatting — so double-check the imports match the locales referenced in your UI.

## Usage

### Basic Usage

Without children, the root auto-renders the formatted value using the `value` slot.

```tsx
<NumberValue value={1234.56} />
```

### Currency

Use `numberStyle="currency"` together with a `currency` ISO code.

```tsx
<NumberValue numberStyle="currency" currency="USD" value={228441} />
<NumberValue numberStyle="currency" currency="EUR" value={228441} />
<NumberValue numberStyle="currency" currency="JPY" maximumFractionDigits={0} value={228441} />
```

### Percent

Values are interpreted as fractions — `0.033` displays as `3.3%`.

```tsx
<NumberValue numberStyle="percent" maximumFractionDigits={1} value={0.033} />
<NumberValue numberStyle="percent" signDisplay="exceptZero" value={-0.021} />
```

### Compact Notation

Renders short scale abbreviations (`1.2K`, `3.4M`). Requires the FormatJS polyfills — see the compatibility section above.

```tsx
<NumberValue notation="compact" value={1234567} />
```

### Sign Display

Controls when a sign character is emitted. Useful for KPIs and deltas.

```tsx
<NumberValue signDisplay="auto" value={-42} />
<NumberValue signDisplay="always" value={42} />
<NumberValue signDisplay="exceptZero" value={0} />
<NumberValue signDisplay="never" value={-42} />
```

### With Prefix and Suffix

Compose inline content around the value. When children are provided, include `NumberValue.Value` explicitly to position the formatted string.

```tsx
<NumberValue value={228441}>
  <NumberValue.Value />
  <NumberValue.Suffix className="text-muted text-sm ml-1">revenue</NumberValue.Suffix>
</NumberValue>

<NumberValue notation="compact" value={9800}>
  <NumberValue.Prefix className="text-muted text-sm mr-1">approx</NumberValue.Prefix>
  <NumberValue.Value />
  <NumberValue.Suffix className="text-muted text-sm ml-1">downloads</NumberValue.Suffix>
</NumberValue>
```

### Raw `formatOptions` Pass-through

For advanced use cases (accounting sign, units, scientific notation), pass `formatOptions` directly. When provided, it overrides every individual convenience prop (`numberStyle`, `currency`, `unit`, `notation`, `signDisplay`, `minimumFractionDigits`, `maximumFractionDigits`).

```tsx
<NumberValue
  value={-1234.56}
  formatOptions={{
    style: 'currency',
    currency: 'USD',
    currencySign: 'accounting',
  }}
/>

<NumberValue
  value={96}
  formatOptions={{
    style: 'unit',
    unit: 'kilometer-per-hour',
    unitDisplay: 'short',
  }}
/>
```

### Locale Override

Override the device locale for an individual instance. Requires the matching polyfill locale data (see compatibility section).

```tsx
<NumberValue
  locale="de-DE"
  numberStyle="currency"
  currency="EUR"
  value={1234.56}
/>
```

### Styling Slots

The root exposes two slots — `container` (the outer `View`) and `value` (the inner `Text`). Use `classNames` to style both in one place, or target the value `Text` through the `classNames.value` slot.

```tsx
<NumberValue
  classNames={{ container: 'gap-1', value: 'text-2xl font-semibold' }}
  numberStyle="currency"
  currency="USD"
  value={228441}
/>
```

### Render-function Children

For fully custom rendering, pass a function that receives the formatted string. No wrapping container is rendered in this form.

```tsx
<NumberValue value={1234.56}>
  {(formatted) => (
    <View className="flex-row items-baseline gap-2">
      <Text className="text-lg">$</Text>
      <Text className="text-3xl font-semibold">{formatted}</Text>
    </View>
  )}
</NumberValue>
```

### Tabular Numbers

`NumberValue.Value` applies `fontVariant: tabular-nums` to its `Text` so digits occupy fixed-width cells — rows of numbers line up cleanly without manual alignment.

```tsx
<View className="items-end">
  <NumberValue numberStyle="currency" currency="USD" value={228441} />
  <NumberValue numberStyle="currency" currency="USD" value={71887} />
  <NumberValue numberStyle="currency" currency="USD" value={156540} />
</View>
```

### Disabling Animations for Descendants

`NumberValue` is a read-only text display and has no intrinsic animation. The `animation` prop is still exposed so that, when animated components are composed inside the value (e.g. a render-function layout), you can cascade a single `"disable-all"` setting to all of them via `AnimationSettingsProvider`.

```tsx
<NumberValue animation="disable-all" value={1234.56}>
  {(formatted) => (
    <Surface className="flex-row items-baseline gap-2 px-3 py-2">
      <Text className="text-3xl font-semibold">{formatted}</Text>
    </Surface>
  )}
</NumberValue>
```

The root also respects the global animation settings and any parent `AnimationSettingsProvider`, using priority `global > parent > own` — so you rarely need to set this prop directly unless you want to locally opt out of animations for a subtree.

## Example

```tsx
import { NumberValue, Surface } from 'heroui-native-pro';
import { Text, View } from 'react-native';

export default function NumberValueExample() {
  return (
    <View className="flex-1 justify-center px-5">
      <Surface className="rounded-3xl p-6 gap-6">
        <View className="gap-1">
          <Text className="text-muted text-xs">Monthly revenue</Text>
          <NumberValue
            classNames={{ value: 'text-3xl font-semibold' }}
            numberStyle="currency"
            currency="USD"
            value={228441}
          >
            <NumberValue.Value />
            <NumberValue.Suffix className="text-muted text-sm ml-1">
              / month
            </NumberValue.Suffix>
          </NumberValue>
        </View>

        <View className="gap-1">
          <Text className="text-muted text-xs">Active users</Text>
          <NumberValue
            classNames={{ value: 'text-3xl font-semibold' }}
            notation="compact"
            value={1234567}
          >
            <NumberValue.Value />
            <NumberValue.Suffix className="text-muted text-sm ml-1">
              users
            </NumberValue.Suffix>
          </NumberValue>
        </View>

        <View className="gap-1">
          <Text className="text-muted text-xs">Conversion</Text>
          <NumberValue
            classNames={{ value: 'text-3xl font-semibold' }}
            numberStyle="percent"
            signDisplay="exceptZero"
            maximumFractionDigits={1}
            value={0.042}
          />
        </View>
      </Surface>
    </View>
  );
}
```

## API Reference

### NumberValue

| prop                    | type                                                        | default       | description                                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `value`                 | `number`                                                    | -             | The numeric value to format.                                                                                                                                             |
| `children`              | `React.ReactNode \| (formatted: string) => React.ReactNode` | -             | `ReactNode` to compose layout with `NumberValue.Value` / `Prefix` / `Suffix`, a render function receiving the formatted string, or `undefined` to auto-render the value. |
| `formatOptions`         | `Intl.NumberFormatOptions`                                  | -             | Raw `Intl.NumberFormat` options. When provided, overrides every convenience prop below.                                                                                  |
| `locale`                | `string`                                                    | device locale | BCP-47 locale identifier (e.g. `"en-US"`, `"de-DE"`).                                                                                                                    |
| `numberStyle`           | `"currency" \| "decimal" \| "percent" \| "unit"`            | `"decimal"`   | Formatting style (mapped to `Intl.NumberFormat`'s `style`).                                                                                                              |
| `currency`              | `string`                                                    | -             | ISO currency code. Required when `numberStyle="currency"`.                                                                                                               |
| `unit`                  | `string`                                                    | -             | Unit identifier (e.g. `"kilometer-per-hour"`). Required when `numberStyle="unit"`.                                                                                       |
| `notation`              | `"compact" \| "engineering" \| "scientific" \| "standard"`  | `"standard"`  | Numeric notation. `"compact"` / `"scientific"` / `"engineering"` require the FormatJS polyfills.                                                                         |
| `signDisplay`           | `"always" \| "auto" \| "exceptZero" \| "never"`             | `"auto"`      | Controls when the sign character is emitted. Non-`"auto"` values require the FormatJS polyfills.                                                                         |
| `minimumFractionDigits` | `number`                                                    | -             | Minimum number of fraction digits.                                                                                                                                       |
| `maximumFractionDigits` | `number`                                                    | -             | Maximum number of fraction digits.                                                                                                                                       |
| `className`             | `string`                                                    | -             | Additional CSS classes merged into the `container` slot.                                                                                                                 |
| `classNames`            | `ElementSlots<RootSlots>`                                   | -             | CSS classes per root slot (see below).                                                                                                                                   |
| `style`                 | `StyleProp<ViewStyle>`                                      | -             | Inline style applied to the outer `View` (merged after `styles.container`).                                                                                              |
| `styles`                | `NumberValueRootStyles`                                     | -             | Inline styles per root slot (see below).                                                                                                                                 |
| `animation`             | `AnimationRootDisableAll`                                   | -             | Animation configuration. `NumberValue` has no intrinsic animation; this prop exists to cascade the `"disable-all"` setting to animated descendants (see below).          |
| `...ViewProps`          | `ViewProps`                                                 | -             | All standard React Native View props are supported.                                                                                                                      |

#### `AnimationRootDisableAll`

Animation configuration for the `NumberValue` root. `NumberValue` itself is a read-only display and has no intrinsic animation — this prop only cascades the disabled state to any animated descendants rendered inside the value (via `AnimationSettingsProvider`). Can be:

- `"disable-all"`: Disable all animations for animated descendants composed inside `NumberValue` (cascades down).
- `undefined`: Inherit the animation settings from the parent / global context.

#### `ElementSlots<RootSlots>`

| prop        | type     | description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `container` | `string` | Class names for the outer `View` container slot. |
| `value`     | `string` | Class names for the inner value `Text` slot.     |

#### `NumberValueRootStyles`

| prop        | type        | description                                    |
| ----------- | ----------- | ---------------------------------------------- |
| `container` | `ViewStyle` | Inline style applied to the outer `View` slot. |
| `value`     | `TextStyle` | Inline style applied to the inner `Text` slot. |

### NumberValue.Value

Renders the formatted numeric string from the nearest `NumberValue` context. The root's `value` slot class names and inline styles are forwarded automatically so a consumer-placed `Value` matches the auto-rendered default.

| prop           | type        | default             | description                                                                                                            |
| -------------- | ----------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `children`     | `ReactNode` | context `formatted` | Override the rendered text. Useful for rare cases where you want to display something other than the formatted string. |
| `className`    | `string`    | -                   | Additional CSS classes merged with the root's `value` slot classes.                                                    |
| `...TextProps` | `TextProps` | -                   | All standard React Native Text props are supported.                                                                    |

### NumberValue.Prefix

Inline `Text` placed before the value. Use for leading labels, unit symbols, or modifier words such as `approx`.

| prop           | type        | default | description                                          |
| -------------- | ----------- | ------- | ---------------------------------------------------- |
| `children`     | `ReactNode` | -       | Prefix content (typically a string).                 |
| `className`    | `string`    | -       | Additional CSS classes applied to the prefix `Text`. |
| `...TextProps` | `TextProps` | -       | All standard React Native Text props are supported.  |

### NumberValue.Suffix

Inline `Text` placed after the value. Use for trailing labels (e.g. `/ month`, `users`) or unit symbols.

| prop           | type        | default | description                                          |
| -------------- | ----------- | ------- | ---------------------------------------------------- |
| `children`     | `ReactNode` | -       | Suffix content (typically a string).                 |
| `className`    | `string`    | -       | Additional CSS classes applied to the suffix `Text`. |
| `...TextProps` | `TextProps` | -       | All standard React Native Text props are supported.  |

### useNumberValue

Hook to access the `NumberValue` root context. Must be used within a `NumberValue` component — primarily useful when building custom parts that need to read the formatted string or inherit the root's `value` slot styling.

```tsx
import { useNumberValue } from 'heroui-native-pro';

const { formatted, valueClassName, valueStyle } = useNumberValue();
```

#### Returns

| property         | type                      | description                                                                                                                                    |
| ---------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `formatted`      | `string`                  | Locale-formatted representation of the root's `value`.                                                                                         |
| `valueClassName` | `Exclude<ClassValue, 0n>` | Class names configured on the root's `value` slot (via `classNames.value`). Forward to keep styling consistent with the auto-rendered default. |
| `valueStyle`     | `StyleProp<TextStyle>`    | Inline style configured on the root's `value` slot (via `styles.value`). Forward to keep styling consistent with the auto-rendered default.    |
