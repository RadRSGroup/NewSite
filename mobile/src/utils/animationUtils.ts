import { Animated, Easing } from 'react-native';
import { SpringConfig } from 'react-native-reanimated';
import { appConfig } from '../config/appConfig';

// Standard animation presets
export const AnimationPresets = {
  fade: {
    in: {
      duration: appConfig.animationConfig.timing.normal,
      toValue: 1,
      easing: Easing.ease,
      useNativeDriver: true,
    },
    out: {
      duration: appConfig.animationConfig.timing.normal,
      toValue: 0,
      easing: Easing.ease,
      useNativeDriver: true,
    },
  },
  
  slideUp: {
    in: {
      duration: appConfig.animationConfig.timing.normal,
      toValue: 0,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    },
    out: {
      duration: appConfig.animationConfig.timing.normal,
      toValue: 100,
      easing: Easing.in(Easing.back(1.5)),
      useNativeDriver: true,
    },
  },

  scale: {
    in: {
      duration: appConfig.animationConfig.timing.normal,
      toValue: 1,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    },
    out: {
      duration: appConfig.animationConfig.timing.normal,
      toValue: 0,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    },
  },
};

// Spring animation configurations
export const SpringPresets: Record<string, SpringConfig> = {
  gentle: {
    damping: 15,
    mass: 1,
    stiffness: 130,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },
  bouncy: {
    damping: 8,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },
  swift: {
    damping: 20,
    mass: 1,
    stiffness: 200,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },
};

// Utility functions for common animation patterns
export const AnimationUtils = {
  // Create staggered animations for multiple elements
  createStaggeredAnimations: (
    animations: Animated.Value[],
    config: Partial<Animated.TimingAnimationConfig> = {},
    staggerDelay: number = 100
  ) => {
    return animations.map((anim, index) =>
      Animated.timing(anim, {
        ...AnimationPresets.fade.in,
        ...config,
        delay: (config.delay || 0) + index * staggerDelay,
      })
    );
  },

  // Create parallel animations
  createParallelAnimations: (
    animations: { 
      animation: Animated.Value;
      config: Partial<Animated.TimingAnimationConfig>;
    }[]
  ) => {
    return Animated.parallel(
      animations.map(({ animation, config }) =>
        Animated.timing(animation, {
          ...AnimationPresets.fade.in,
          ...config,
        })
      )
    );
  },

  // Create sequence of animations
  createSequenceAnimations: (
    animations: { 
      animation: Animated.Value;
      config: Partial<Animated.TimingAnimationConfig>;
    }[]
  ) => {
    return Animated.sequence(
      animations.map(({ animation, config }) =>
        Animated.timing(animation, {
          ...AnimationPresets.fade.in,
          ...config,
        })
      )
    );
  },

  // Create a loop animation
  createLoopAnimation: (
    animation: Animated.Value,
    config: Partial<Animated.TimingAnimationConfig> = {},
    iterations: number = -1
  ) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          ...AnimationPresets.fade.in,
          ...config,
        }),
        Animated.timing(animation, {
          ...AnimationPresets.fade.out,
          ...config,
        }),
      ]),
      { iterations }
    );
  },

  // Create interpolated animations
  createInterpolation: (
    animation: Animated.Value,
    inputRange: number[],
    outputRange: number[] | string[]
  ) => {
    return animation.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    });
  },
};

// Performance optimization utilities
export const AnimationPerformance = {
  // Determine if we should reduce animations based on device performance
  shouldReduceAnimations: () => {
    return appConfig.performanceConfig.enableHighQualityRendering === false;
  },

  // Get adjusted animation duration based on device performance
  getAdjustedDuration: (duration: number) => {
    return AnimationPerformance.shouldReduceAnimations() ? duration * 0.7 : duration;
  },

  // Get adjusted spring configuration based on device performance
  getAdjustedSpringConfig: (config: SpringConfig): SpringConfig => {
    if (AnimationPerformance.shouldReduceAnimations()) {
      return {
        ...config,
        stiffness: config.stiffness * 1.2,
        damping: config.damping * 1.2,
      };
    }
    return config;
  },
};

export default {
  Presets: AnimationPresets,
  Springs: SpringPresets,
  Utils: AnimationUtils,
  Performance: AnimationPerformance,
};
