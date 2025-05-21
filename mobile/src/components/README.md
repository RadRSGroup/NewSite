# RS Group Mobile App Components

## 3D Components and Effects

### Animated3DBackground
A reusable 3D particle system background that provides interactive animations and customizable effects.

```typescript
import Animated3DBackground from '../components/Animated3DBackground';

// Basic usage
<Animated3DBackground />

// With customization
<Animated3DBackground
  type="hero"           // 'hero' or 'background'
  intensity={1.2}      // Animation intensity (default: 1.0)
  interactive={true}   // Enable mouse/touch interaction
/>
```

### GlassCard
A component that creates a glass-morphism effect with optional animations.

```typescript
import GlassCard from '../components/GlassCard';

<GlassCard
  style={styles.card}
  animated={true}
  animationDelay={200}
>
  {/* Card content */}
</GlassCard>
```

### Button
A customizable button component with glass-morphism effects and loading states.

```typescript
import Button from '../components/ui/Button';

<Button
  title="Click Me"
  onPress={() => {}}
  variant="primary"    // 'primary', 'secondary', or 'ghost'
  size="medium"       // 'small', 'medium', or 'large'
  glassEffect={true}
  animated={true}
  loading={false}
/>
```

## Performance Considerations

### Device Optimization
- The particle system automatically adjusts particle count based on device capabilities
- Animation complexity is reduced on lower-end devices
- Glass effects can be disabled for better performance

### Best Practices
1. Use appropriate particle counts:
   - Hero sections: 3000-5000 particles
   - Background sections: 1000-3000 particles

2. Animation intensity:
   - Hero sections: 1.0-1.5
   - Background sections: 0.5-0.8

3. Interactive effects:
   - Enable for hero sections
   - Consider disabling for background sections on scroll

## Customization

### Particle System Configuration
```typescript
// In threeUtils.ts
export const particleConfigs = {
  hero: {
    count: 5000,
    size: 0.005,
    spread: 10,
    speed: 0.1,
    color: '#ffffff',
    opacity: 1.0,
  },
  background: {
    count: 3000,
    size: 0.003,
    spread: 8,
    speed: 0.05,
    color: '#ffffff',
    opacity: 0.7,
  },
};
```

### Glass Effect Customization
```typescript
// In GlassCard component
<BlurView
  style={styles.glass}
  blurType="light"
  blurAmount={10}
>
  {/* Content */}
</BlurView>
```

## Animation Examples

### Particle Movement
```typescript
// Create wave pattern
const wavePattern = (position, time) => {
  position.y = Math.sin(time * 0.1 + position.x) * 0.5;
  return position;
};

// Create vortex pattern
const vortexPattern = (position, time) => {
  const angle = time + position.z;
  position.x = Math.cos(angle) * radius;
  position.y = Math.sin(angle) * radius;
  return position;
};
```

### Interactive Effects
```typescript
// Add mouse/touch interaction
const handleInteraction = (x, y) => {
  particles.rotation.x += y * 0.0002;
  particles.rotation.y += x * 0.0002;
};
```

## Integration with React Navigation

The components are designed to work seamlessly with React Navigation transitions:

```typescript
// In NavigationConfig.tsx
const screenOptions = {
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  presentation: 'card',
};
```

## Error Handling

Components include built-in error boundaries and fallback rendering:

```typescript
// Example error boundary usage
<ErrorBoundary fallback={<FallbackComponent />}>
  <Animated3DBackground />
</ErrorBoundary>
```

## Testing

Components are designed to be testable with React Native Testing Library:

```typescript
import { render, fireEvent } from '@testing-library/react-native';

test('Button handles press events', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <Button title="Test" onPress={onPress} />
  );
  fireEvent.press(getByText('Test'));
  expect(onPress).toHaveBeenCalled();
});
```
