import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated3DBackground from '../components/Animated3DBackground';
import GlassCard from '../components/GlassCard';
import { colors, typography, spacing, layout } from '../styles/theme';
import appConfig from '../config/appConfig';

const AboutScreen = () => {
  const navigation = useNavigation();
  const [scrollY] = useState(new Animated.Value(0));

  const parallaxY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated3DBackground type="background" intensity={0.8} interactive={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}>
        <GlassCard style={styles.headerCard} animated>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>
        </GlassCard>

        <Animated.View style={[styles.contentContainer, { transform: [{ translateY: parallaxY }] }]}>
          <GlassCard style={styles.aboutCard} animated>
            <Text style={styles.title}>We are Doers.</Text>
            <Text style={styles.lead}>We believe in the power of Dreams.</Text>
            <Text style={styles.lead}>
              We've turned ideas into thriving businesses, transforming visions into reality. 
              We've felt the joy of success and the sting of failure.
            </Text>
            
            <Text style={styles.paragraph}>
              We know you; Leaders with vision that make it happen and drive success. 
              You are where the buck stops.
            </Text>
            
            <Text style={styles.paragraph}>
              We share your passion for business and the opportunity it creates to make 
              the world a better place. We make our dent in the world helping your 
              company succeed.
            </Text>
            
            <Text style={styles.salute}>We salute you.</Text>
          </GlassCard>

          <GlassCard 
            style={styles.missionCard} 
            animated 
            animationDelay={200}>
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              "Resourced Services Group is committed to excellence. We can, and we will, 
              change ideas about what is possible. We choose to serve as leaders who face 
              challenges head-on, unafraid. We do this because we believe confidently in 
              our ability to create the future."
            </Text>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  contentContainer: {
    flex: 1,
    gap: spacing.xl,
  },
  headerCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.regular,
  },
  aboutCard: {
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.title2,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  lead: {
    fontSize: typography.sizes.large,
    color: colors.text.primary,
    marginBottom: spacing.md,
    opacity: 0.9,
  },
  paragraph: {
    fontSize: typography.sizes.regular,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeights.regular * typography.sizes.regular,
  },
  salute: {
    fontSize: typography.sizes.title3,
    color: colors.text.primary,
    fontStyle: 'italic',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  missionCard: {
    padding: spacing.xl,
  },
  missionTitle: {
    fontSize: typography.sizes.title3,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  missionText: {
    fontSize: typography.sizes.regular,
    color: colors.text.secondary,
    lineHeight: typography.lineHeights.regular * typography.sizes.regular,
    fontStyle: 'italic',
  },
});

export default AboutScreen;
