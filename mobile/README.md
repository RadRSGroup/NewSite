# RS Group Mobile App

A React Native version of the RS Group website, featuring stunning 3D effects and animations using React Three Fiber.

## Features

- Interactive 3D particle effects and animations
- Glass-morphism UI design
- Smooth transitions and gestures
- Responsive layout for various device sizes
- Performance optimizations for mobile devices
- Form validation and error handling
- Consistent styling system

## Tech Stack

- React Native
- React Three Fiber for 3D graphics
- React Navigation for routing
- Reanimated for advanced animations
- React Native Gesture Handler
- TypeScript for type safety

## Project Structure

```
mobile/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Animated3DBackground.tsx
│   │   ├── GlassCard.tsx
│   │   └── LoadingScreen.tsx
│   ├── screens/          # Main app screens
│   │   ├── HomeScreen.tsx
│   │   ├── AboutScreen.tsx
│   │   ├── ServicesScreen.tsx
│   │   └── ContactScreen.tsx
│   ├── navigation/       # Navigation configuration
│   │   └── NavigationConfig.tsx
│   ├── styles/          # Global styles and theme
│   │   └── theme.ts
│   ├── utils/           # Utility functions
│   │   └── threeUtils.ts
│   └── config/          # App configuration
│       └── appConfig.ts
├── App.tsx              # Root component
└── package.json         # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js >= 14
- npm or yarn
- React Native development environment setup
- iOS/Android development tools

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mobile
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Install iOS dependencies (iOS only)
```bash
cd ios
pod install
cd ..
```

4. Start the development server
```bash
npm start
# or
yarn start
```

5. Run the app
```bash
# For iOS
npm run ios
# or
yarn ios

# For Android
npm run android
# or
yarn android
```

## Development Guidelines

### 3D Effects

- Use the `Animated3DBackground` component for consistent particle effects
- Adjust intensity and interactivity based on screen context
- Consider performance implications on different devices

### Styling

- Follow the theme configuration in `src/styles/theme.ts`
- Use `GlassCard` for consistent glass-morphism effects
- Maintain consistent spacing using the spacing constants
- Use typography scale for font sizes

### Animation Guidelines

- Use Reanimated for complex animations
- Implement gesture-based interactions where appropriate
- Consider reducing animations on low-end devices
- Use shared element transitions for smooth navigation

### Performance Optimization

- Implement lazy loading for heavy components
- Use React.memo() for pure components
- Optimize 3D effects based on device capabilities
- Monitor and test on various device tiers

### Best Practices

- Write clean, maintainable TypeScript code
- Follow React Native best practices
- Implement proper error handling
- Add comments for complex logic
- Test on both iOS and Android
- Consider accessibility features

## Testing

```bash
# Run tests
npm test
# or
yarn test
```

## Building for Production

### iOS
```bash
cd ios
xcodebuild -workspace RSGroup.xcworkspace -scheme RSGroup -configuration Release
```

### Android
```bash
cd android
./gradlew assembleRelease
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
