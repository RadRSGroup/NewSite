import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing } from '../styles/theme';
import Animated3DBackground from './Animated3DBackground';
import GlassCard from './GlassCard';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...'
}) => {
  const [rotation] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Rotate animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated3DBackground 
        type="hero" 
        intensity={1.5} 
        interactive={false} 
      />
      
      <Animated.View style={[styles.content, { opacity }]}>
        <GlassCard style={styles.card}>
          <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
          <Text style={styles.text}>{message}</Text>
        </GlassCard>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  card: {
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 200,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: colors.text.muted,
    borderTopColor: colors.primary,
    marginBottom: spacing.md,
  },
  text: {
    color: colors.text.primary,
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.medium,
  },
});

export default LoadingScreen;
