import React from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  Animated,
} from 'react-native';
import { colors, typography, spacing, layout } from '../../styles/theme';
import GlassCard from '../GlassCard';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  glassEffect?: boolean;
  animated?: boolean;
  animationDelay?: number;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  error = false,
  style,
  textStyle,
  glassEffect = true,
  animated = false,
  animationDelay = 0,
}) => {
  // Scale animation for press feedback
  const [scaleAnim] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'ghost':
        return styles.ghostButton;
      default:
        return styles.primaryButton;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextStyles = (): TextStyle => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  const buttonContent = (
    <Animated.View
      style={[
        styles.container,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabledButton,
        error && styles.errorButton,
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? colors.primary : colors.text.primary}
          size={size === 'small' ? 'small' : 'large'}
        />
      ) : (
        <Text
          style={[
            styles.text,
            getTextStyles(),
            variant === 'ghost' && styles.ghostText,
            disabled && styles.disabledText,
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </Animated.View>
  );

  const renderContent = () => {
    if (glassEffect) {
      return (
        <GlassCard
          style={styles.glassContainer}
          animated={animated}
          animationDelay={animationDelay}>
          {buttonContent}
        </GlassCard>
      );
    }
    return buttonContent;
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
      ]}>
      {renderContent()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.borderRadius.medium,
  },
  glassContainer: {
    overflow: 'hidden',
    borderRadius: layout.borderRadius.medium,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minWidth: 80,
  },
  mediumButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minWidth: 120,
  },
  largeButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minWidth: 160,
  },
  text: {
    textAlign: 'center',
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  smallText: {
    fontSize: typography.sizes.small,
  },
  mediumText: {
    fontSize: typography.sizes.regular,
  },
  largeText: {
    fontSize: typography.sizes.large,
  },
  ghostText: {
    color: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.text.muted,
  },
  errorButton: {
    backgroundColor: colors.status.error,
  },
});

export default Button;
