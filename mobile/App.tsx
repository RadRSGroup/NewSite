import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/NavigationConfig';
import { colors, typography } from './src/styles/theme';

// Ignore specific warnings that are known and handled
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  '[react-native-gesture-handler] Seems like you\'re using an old API with gesture components',
]);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to your error reporting service
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops! Something went wrong.</Text>
          <Text style={styles.errorMessage}>
            Please try restarting the app. If the problem persists, contact support.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Loading Component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Three.js and check device capabilities
        const deviceSupports3D = await checkDeviceCapabilities();
        
        // Adjust performance settings based on device capabilities
        if (!deviceSupports3D) {
          appConfig.featureFlags.enable3DEffects = false;
          appConfig.performanceConfig.enableHighQualityRendering = false;
        }

        setIs3DReady(deviceSupports3D);

        // Simulate any other initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        // Fallback to basic mode without 3D effects
        appConfig.featureFlags.enable3DEffects = false;
        setIs3DReady(false);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Check device capabilities
  const checkDeviceCapabilities = async () => {
    try {
      // Check if device supports WebGL
      const gl = document.createElement('canvas').getContext('webgl');
      if (!gl) return false;

      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      if (deviceMemory && deviceMemory < 4) return false;

      // Check device performance
      const performanceCheck = await new Promise(resolve => {
        let startTime = performance.now();
        let iterations = 0;
        
        const checkPerformance = () => {
          iterations++;
          if (iterations >= 1000 || performance.now() - startTime > 100) {
            resolve(iterations >= 1000);
          } else {
            requestAnimationFrame(checkPerformance);
          }
        };
        
        requestAnimationFrame(checkPerformance);
      });

      return performanceCheck;
    } catch (error) {
      console.warn('Device capability check error:', error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <LoadingScreen message="Initializing..." />
      </SafeAreaProvider>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: typography.sizes.title3,
    color: colors.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: typography.sizes.regular,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: typography.sizes.large,
    color: colors.text.primary,
  },
});

export default App;
