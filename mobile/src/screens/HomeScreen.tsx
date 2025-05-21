import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated3DBackground from '../components/Animated3DBackground';
import GlassCard from '../components/GlassCard';
import { colors, typography, spacing, layout } from '../styles/theme';
import appConfig from '../config/appConfig';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: appConfig.animationConfig.timing.slow,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigationButtons = [
    { title: 'About', screen: 'About' },
    { title: 'Services', screen: 'Services' },
    { title: 'Contact', screen: 'Contact' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Animated3DBackground type="hero" intensity={1.2} interactive={true} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <GlassCard style={styles.heroCard}>
          <Text style={styles.title}>RS Group</Text>
          <Text style={styles.subtitle}>
            Transforming Institutional Knowledge into Innovative Solutions
          </Text>
        </GlassCard>
        
        <View style={styles.nav}>
          {navigationButtons.map((button, index) => (
            <GlassCard
              key={button.screen}
              style={styles.navButtonContainer}
              animated
              animationDelay={index * 200}>
              <Pressable
                style={styles.navButton}
                onPress={() => navigation.navigate(button.screen)}>
                <Text style={styles.navText}>{button.title}</Text>
              </Pressable>
            </GlassCard>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  heroCard: {
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    maxWidth: layout.maxWidth * 0.8,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.title1,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.sizes.large,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  navButtonContainer: {
    minWidth: 120,
  },
  navButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  navText: {
    color: colors.text.primary,
    fontSize: typography.sizes.regular,
    fontWeight: typography.weights.medium,
  },
});

export default HomeScreen;
