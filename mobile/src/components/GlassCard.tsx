import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, Animated } from 'react-native';
import { BlurView } from '@react-native-community/blur';

interface GlassCardProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  blurAmount?: number;
  animated?: boolean;
  animationDelay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
  style,
  children,
  blurAmount = 10,
  animated = false,
  animationDelay = 0,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          delay: animationDelay,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1000,
          delay: animationDelay,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated, animationDelay]);

  const Container = animated ? Animated.View : React.Fragment;
  const containerProps = animated
    ? {
        style: [
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ],
      }
    : {};

  return (
    <Container {...containerProps}>
      <BlurView
        style={[styles.glassCard, style]}
        blurType="light"
        blurAmount={blurAmount}>
        {children}
      </BlurView>
    </Container>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default GlassCard;
